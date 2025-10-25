using BusReservationSystem.Domain.Entities;

namespace BusReservationSystem.Application.Contracts.Persistence;

public interface IPassengerRepository
{
    Task AddAsync(Passenger passenger, CancellationToken cancellationToken = default);
}
