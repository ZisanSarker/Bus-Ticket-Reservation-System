using BusReservationSystem.Application.Contracts.Persistence;
using BusReservationSystem.Domain.Entities;
using BusReservationSystem.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace BusReservationSystem.Infrastructure.Persistence;

internal sealed class TicketRepository : ITicketRepository
{
    private readonly AppDbContext _db;

    public TicketRepository(AppDbContext db)
    {
        _db = db;
    }

    public Task<int> CountByScheduleAsync(Guid busScheduleId, CancellationToken cancellationToken = default)
        => _db.Tickets.AsNoTracking().CountAsync(t => t.BusScheduleId == busScheduleId, cancellationToken);

    public async Task<IReadOnlySet<Guid>> GetSeatIdsBookedForScheduleAsync(Guid busScheduleId, CancellationToken cancellationToken = default)
    {
        var list = await _db.Tickets.AsNoTracking()
            .Where(t => t.BusScheduleId == busScheduleId)
            .Select(t => t.SeatId)
            .ToListAsync(cancellationToken);
        return list.ToHashSet();
    }

    public async Task<IReadOnlyList<Ticket>> GetByScheduleAndSeatIdsAsync(Guid busScheduleId, IEnumerable<Guid> seatIds, CancellationToken cancellationToken = default)
    {
        var ids = seatIds.Distinct().ToArray();
        var list = await _db.Tickets.AsNoTracking()
            .Where(t => t.BusScheduleId == busScheduleId && ids.Contains(t.SeatId))
            .ToListAsync(cancellationToken);
        return list;
    }

    public Task AddRangeAsync(IEnumerable<Ticket> tickets, CancellationToken cancellationToken = default)
        => _db.Tickets.AddRangeAsync(tickets, cancellationToken);
}
