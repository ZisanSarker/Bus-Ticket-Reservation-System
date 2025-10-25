using BusReservationSystem.Domain.Entities;
using BusReservationSystem.Domain.ValueObjects;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace BusReservationSystem.Infrastructure.Data;

public static class DbSeeder
{
    public static async Task MigrateAndSeedAsync(this IServiceProvider services, CancellationToken cancellationToken = default)
    {
        using var scope = services.CreateScope();
        var logger = scope.ServiceProvider.GetRequiredService<ILoggerFactory>().CreateLogger("DbSeeder");
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

        // Apply migrations
        await db.Database.MigrateAsync(cancellationToken);

        // Seed if empty
        if (await db.Buses.AnyAsync(cancellationToken))
        {
            logger.LogInformation("Database already seeded.");
            return;
        }

        logger.LogInformation("Seeding initial data...");

        // Sample buses
        var bus1 = new Bus("Skyline Express", "Skyline Co.", 40);
        var bus2 = new Bus("GreenLine Deluxe", "GreenLine Ltd.", 36);

    await db.Buses.AddRangeAsync(new[] { bus1, bus2 }, cancellationToken);

        // Seats for buses
        var seats = new List<Seat>();
        foreach (var bus in new[] { bus1, bus2 })
        {
            var total = bus.TotalSeats;
            for (var i = 1; i <= total; i++)
            {
                var row = (i - 1) / 4; // 4 seats per row layout approximation
                seats.Add(new Seat(bus.Id, i, row));
            }
        }
        await db.Seats.AddRangeAsync(seats, cancellationToken);

        // Routes
        var route1 = new Route(City.From("Dhaka"), City.From("Chittagong"), DistanceKm.From(250));
        var route2 = new Route(City.From("Dhaka"), City.From("Sylhet"), DistanceKm.From(240));
    await db.Routes.AddRangeAsync(new[] { route1, route2 }, cancellationToken);

        // Schedules
        var today = DateOnly.FromDateTime(DateTime.UtcNow.Date);
        var tomorrow = today.AddDays(1);

        var schedules = new List<BusSchedule>
        {
            new(bus1.Id, route1.Id, tomorrow, new TimeOnly(7, 30), new TimeOnly(12, 0), 800),
            new(bus2.Id, route1.Id, tomorrow, new TimeOnly(9, 0), new TimeOnly(13, 15), 750),
            new(bus1.Id, route2.Id, tomorrow, new TimeOnly(8, 0), new TimeOnly(12, 0), 700)
        };
        await db.BusSchedules.AddRangeAsync(schedules, cancellationToken);

        await db.SaveChangesAsync(cancellationToken);

        logger.LogInformation("Seeding complete.");
    }
}
