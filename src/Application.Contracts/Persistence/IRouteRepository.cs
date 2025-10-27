using BusReservationSystem.Domain.Entities;

namespace BusReservationSystem.Application.Contracts.Persistence;

public interface IRouteRepository
{
    // Returns all routes that match the provided from/to names (case-insensitive, trimmed)
    Task<IReadOnlyList<Route>> GetByCitiesAsync(string from, string to, CancellationToken cancellationToken = default);

    // Returns a distinct, alphabetically sorted list of all city names present in routes (from/to)
    Task<IReadOnlyList<string>> GetAllCitiesAsync(CancellationToken cancellationToken = default);
}
