using BusReservationSystem.Application.Contracts.Persistence;
using BusReservationSystem.Domain.Entities;
using BusReservationSystem.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace BusReservationSystem.Infrastructure.Persistence;

internal sealed class SeatRepository : ISeatRepository
{
    private readonly AppDbContext _db;

    public SeatRepository(AppDbContext db)
    {
        _db = db;
    }

    public async Task<IReadOnlyList<Seat>> GetByBusIdAsync(Guid busId, CancellationToken cancellationToken = default)
    {
        var list = await _db.Seats.AsNoTracking()
            .Where(s => s.BusId == busId)
            .ToListAsync(cancellationToken);
        return list;
    }

    public async Task<IReadOnlyList<Seat>> GetByBusIdAndNumbersAsync(Guid busId, IEnumerable<int> seatNumbers, CancellationToken cancellationToken = default)
    {
        var numbers = seatNumbers.Distinct().ToArray();
        var list = await _db.Seats.AsNoTracking()
            .Where(s => s.BusId == busId && numbers.Contains(s.SeatNumber))
            .ToListAsync(cancellationToken);
        return list;
    }
}
