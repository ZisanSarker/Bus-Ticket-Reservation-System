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
}
