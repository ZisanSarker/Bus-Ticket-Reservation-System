using BusReservationSystem.Application.Contracts.Persistence;
using BusReservationSystem.Domain.Entities;
using BusReservationSystem.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace BusReservationSystem.Infrastructure.Persistence;

internal sealed class BusRepository : IBusRepository
{
    private readonly AppDbContext _db;

    public BusRepository(AppDbContext db)
    {
        _db = db;
    }

    public Task<Bus?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
        => _db.Buses.AsNoTracking().FirstOrDefaultAsync(b => b.Id == id, cancellationToken);
}
