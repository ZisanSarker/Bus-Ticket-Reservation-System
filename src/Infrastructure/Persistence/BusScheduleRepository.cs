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
}
