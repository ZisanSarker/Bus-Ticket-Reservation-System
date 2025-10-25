using BusReservationSystem.Application.Contracts.Persistence;
using BusReservationSystem.Domain.Entities;
using BusReservationSystem.Infrastructure.Data;

namespace BusReservationSystem.Infrastructure.Persistence;

internal sealed class PassengerRepository : IPassengerRepository
{
    private readonly AppDbContext _db;

    public PassengerRepository(AppDbContext db)
    {
        _db = db;
    }

    public async Task AddAsync(Passenger passenger, CancellationToken cancellationToken = default)
    {
        await _db.Passengers.AddAsync(passenger, cancellationToken);
    }
}
