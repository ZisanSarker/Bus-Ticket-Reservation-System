using BusReservationSystem.Domain.Entities;

namespace BusReservationSystem.Application.Contracts.Persistence;

public interface ISeatRepository
{
    Task<IReadOnlyList<Seat>> GetByBusIdAsync(Guid busId, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<Seat>> GetByBusIdAndNumbersAsync(Guid busId, IEnumerable<int> seatNumbers, CancellationToken cancellationToken = default);
}
