using BusReservationSystem.Domain.Entities;

namespace BusReservationSystem.Application.Contracts.Persistence;

public interface IRouteRepository
{
    Task<IReadOnlyList<Route>> GetByCitiesAsync(string from, string to, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<string>> GetAllCitiesAsync(CancellationToken cancellationToken = default);
}
