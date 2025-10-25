using BusReservationSystem.Domain.Entities;

namespace BusReservationSystem.Application.Contracts.Persistence;

public interface IBusScheduleRepository
{
    Task<IReadOnlyList<BusSchedule>> GetByRouteIdsAndDateAsync(IEnumerable<Guid> routeIds, DateOnly journeyDate, CancellationToken cancellationToken = default);
    Task<BusSchedule?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
}
