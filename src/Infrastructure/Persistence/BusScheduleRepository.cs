using BusReservationSystem.Application.Contracts.Persistence;
using BusReservationSystem.Domain.Entities;
using BusReservationSystem.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace BusReservationSystem.Infrastructure.Persistence;

internal sealed class BusScheduleRepository : IBusScheduleRepository
{
    private readonly AppDbContext _db;

    public BusScheduleRepository(AppDbContext db)
    {
        _db = db;
    }

    public async Task<IReadOnlyList<BusSchedule>> GetByRouteIdsAndDateAsync(IEnumerable<Guid> routeIds, DateOnly journeyDate, CancellationToken cancellationToken = default)
    {
        var ids = routeIds.Distinct().ToArray();
        var list = await _db.BusSchedules.AsNoTracking()
            .Where(s => ids.Contains(s.RouteId) && s.JourneyDate == journeyDate)
            .OrderBy(s => s.StartTime)
            .ToListAsync(cancellationToken);
        return list;
    }

    public Task<BusSchedule?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
        => _db.BusSchedules.AsNoTracking().FirstOrDefaultAsync(s => s.Id == id, cancellationToken);

    public async Task<DateOnly?> GetFirstAvailableDateAsync(IEnumerable<Guid> routeIds, DateOnly startDate, CancellationToken cancellationToken = default)
    {
        var ids = routeIds.Distinct().ToArray();
        var first = await _db.BusSchedules.AsNoTracking()
            .Where(s => ids.Contains(s.RouteId) && s.JourneyDate >= startDate)
            .OrderBy(s => s.JourneyDate)
            .Select(s => s.JourneyDate)
            .FirstOrDefaultAsync(cancellationToken);

        if (first == default)
        {
            var any = await _db.BusSchedules.AsNoTracking()
                .AnyAsync(s => ids.Contains(s.RouteId) && s.JourneyDate >= startDate, cancellationToken);
            if (!any) return null;
        }
        return first;
    }
}
