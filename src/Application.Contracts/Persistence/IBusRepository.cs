using BusReservationSystem.Domain.Entities;

namespace BusReservationSystem.Application.Contracts.Persistence;

public interface IBusRepository
{
    Task<Bus?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
}
