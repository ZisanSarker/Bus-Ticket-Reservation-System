using BusReservationSystem.Application.Contracts.Persistence;
using BusReservationSystem.Domain.Entities;
using BusReservationSystem.Domain.ValueObjects;
using BusReservationSystem.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace BusReservationSystem.Tests.TestHelpers;

// Lightweight repository implementations for tests, backed by EF Core InMemory DbContext
internal sealed class TestBusRepository : IBusRepository
{
    private readonly AppDbContext _db;
    public TestBusRepository(AppDbContext db) => _db = db;
    public Task<Bus?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
        => _db.Buses.AsNoTracking().FirstOrDefaultAsync(b => b.Id == id, cancellationToken);
}

internal sealed class TestRouteRepository : IRouteRepository
{
    private readonly AppDbContext _db;
    public TestRouteRepository(AppDbContext db) => _db = db;
    public async Task<IReadOnlyList<Route>> GetByCitiesAsync(string from, string to, CancellationToken cancellationToken = default)
    {
        var fromCity = City.From(from.Trim());
        var toCity = City.From(to.Trim());
        return await _db.Routes.AsNoTracking()
            .Where(r => r.FromCity == fromCity && r.ToCity == toCity)
            .ToListAsync(cancellationToken);
    }

    public async Task<IReadOnlyList<string>> GetAllCitiesAsync(CancellationToken cancellationToken = default)
    {
        var froms = _db.Routes.AsNoTracking().Select(r => EF.Property<string>(r, nameof(r.FromCity)));
        var tos = _db.Routes.AsNoTracking().Select(r => EF.Property<string>(r, nameof(r.ToCity)));
        return await froms.Concat(tos).Distinct().OrderBy(c => c).ToListAsync(cancellationToken);
    }
}

internal sealed class TestPassengerRepository : IPassengerRepository
{
    private readonly AppDbContext _db;
    public TestPassengerRepository(AppDbContext db) => _db = db;
    public Task AddAsync(Passenger passenger, CancellationToken cancellationToken = default)
        => _db.Passengers.AddAsync(passenger, cancellationToken).AsTask();
}

internal sealed class TestSeatRepository : ISeatRepository
{
    private readonly AppDbContext _db;
    public TestSeatRepository(AppDbContext db) => _db = db;

    public async Task<IReadOnlyList<Seat>> GetByBusIdAsync(Guid busId, CancellationToken cancellationToken = default)
        => await _db.Seats.AsNoTracking().Where(s => s.BusId == busId).ToListAsync(cancellationToken);

    public async Task<IReadOnlyList<Seat>> GetByBusIdAndNumbersAsync(Guid busId, IEnumerable<int> seatNumbers, CancellationToken cancellationToken = default)
    {
        var numbers = seatNumbers.Distinct().ToArray();
        return await _db.Seats.AsNoTracking()
            .Where(s => s.BusId == busId && numbers.Contains(s.SeatNumber))
            .ToListAsync(cancellationToken);
    }
}

internal sealed class TestBusScheduleRepository : IBusScheduleRepository
{
    private readonly AppDbContext _db;
    public TestBusScheduleRepository(AppDbContext db) => _db = db;

    public async Task<IReadOnlyList<BusSchedule>> GetByRouteIdsAndDateAsync(IEnumerable<Guid> routeIds, DateOnly journeyDate, CancellationToken cancellationToken = default)
    {
        var ids = routeIds.Distinct().ToArray();
        return await _db.BusSchedules.AsNoTracking()
            .Where(s => ids.Contains(s.RouteId) && s.JourneyDate == journeyDate)
            .OrderBy(s => s.StartTime)
            .ToListAsync(cancellationToken);
    }

    public Task<BusSchedule?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
        => _db.BusSchedules.AsNoTracking().FirstOrDefaultAsync(s => s.Id == id, cancellationToken);

    public async Task<DateOnly?> GetFirstAvailableDateAsync(IEnumerable<Guid> routeIds, DateOnly startDate, CancellationToken cancellationToken = default)
    {
        var ids = routeIds.Distinct().ToArray();
        var first = await _db.BusSchedules.AsNoTracking()
            .Where(s => ids.Contains(s.RouteId) && s.JourneyDate >= startDate)
            .OrderBy(s => s.JourneyDate)
            .Select(s => s.JourneyDate)
            .FirstOrDefaultAsync(cancellationToken);

        if (first == default)
        {
            var any = await _db.BusSchedules.AsNoTracking()
                .AnyAsync(s => ids.Contains(s.RouteId) && s.JourneyDate >= startDate, cancellationToken);
            if (!any) return null;
        }
        return first;
    }
}

internal sealed class TestTicketRepository : ITicketRepository
{
    private readonly AppDbContext _db;
    public TestTicketRepository(AppDbContext db) => _db = db;

    public Task<int> CountByScheduleAsync(Guid busScheduleId, CancellationToken cancellationToken = default)
        => _db.Tickets.AsNoTracking().CountAsync(t => t.BusScheduleId == busScheduleId, cancellationToken);

    public async Task<IReadOnlySet<Guid>> GetSeatIdsBookedForScheduleAsync(Guid busScheduleId, CancellationToken cancellationToken = default)
    {
        var list = await _db.Tickets.AsNoTracking()
            .Where(t => t.BusScheduleId == busScheduleId)
            .Select(t => t.SeatId)
            .ToListAsync(cancellationToken);
        return list.ToHashSet();
    }

    public async Task<IReadOnlyList<Ticket>> GetByScheduleAndSeatIdsAsync(Guid busScheduleId, IEnumerable<Guid> seatIds, CancellationToken cancellationToken = default)
    {
        var ids = seatIds.Distinct().ToArray();
        return await _db.Tickets.AsNoTracking()
            .Where(t => t.BusScheduleId == busScheduleId && ids.Contains(t.SeatId))
            .ToListAsync(cancellationToken);
    }

    public Task AddRangeAsync(IEnumerable<Ticket> tickets, CancellationToken cancellationToken = default)
        => _db.Tickets.AddRangeAsync(tickets, cancellationToken);
}

internal sealed class TestUnitOfWork : IUnitOfWork
{
    private readonly AppDbContext _db;
    public TestUnitOfWork(AppDbContext db) => _db = db;

    public async Task ExecuteInTransactionAsync(Func<CancellationToken, Task> action, CancellationToken cancellationToken = default)
    {
        if (action is null) throw new ArgumentNullException(nameof(action));
        // EF InMemory provider does not support transactions—avoid starting one in tests
        if (_db.Database.IsInMemory())
        {
            await action(cancellationToken);
            await _db.SaveChangesAsync(cancellationToken);
            return;
        }

        await using var tx = await _db.Database.BeginTransactionAsync(cancellationToken);
        try
        {
            await action(cancellationToken);
            await _db.SaveChangesAsync(cancellationToken);
            await tx.CommitAsync(cancellationToken);
        }
        catch
        {
            await tx.RollbackAsync(cancellationToken);
            throw;
        }
    }
}
