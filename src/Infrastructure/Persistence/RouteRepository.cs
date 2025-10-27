using BusReservationSystem.Application.Contracts.Persistence;
using BusReservationSystem.Domain.Entities;
using BusReservationSystem.Domain.ValueObjects;
using BusReservationSystem.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace BusReservationSystem.Infrastructure.Persistence;

internal sealed class RouteRepository : IRouteRepository
{
    private readonly AppDbContext _db;

    public RouteRepository(AppDbContext db)
    {
        _db = db;
    }

    public async Task<IReadOnlyList<Route>> GetByCitiesAsync(string from, string to, CancellationToken cancellationToken = default)
    {
        var fromCity = City.From(from.Trim());
        var toCity = City.From(to.Trim());

        return await _db.Routes
            .AsNoTracking()
            .Where(r => r.FromCity == fromCity && r.ToCity == toCity)
            .ToListAsync(cancellationToken);
    }

    public async Task<IReadOnlyList<string>> GetAllCitiesAsync(CancellationToken cancellationToken = default)
    {
        // Use EF.Property to access the underlying string columns for server-side distinct/sort
        var froms = _db.Routes.AsNoTracking().Select(r => EF.Property<string>(r, nameof(r.FromCity)));
        var tos = _db.Routes.AsNoTracking().Select(r => EF.Property<string>(r, nameof(r.ToCity)));

        return await froms
            .Concat(tos)
            .Distinct()
            .OrderBy(c => c)
            .ToListAsync(cancellationToken);
    }
}
