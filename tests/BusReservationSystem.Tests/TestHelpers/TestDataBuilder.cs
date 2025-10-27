using BusReservationSystem.Domain.Entities;
using BusReservationSystem.Domain.ValueObjects;
using BusReservationSystem.Infrastructure.Data;

namespace BusReservationSystem.Tests.TestHelpers;

internal static class TestDataBuilder
{
    public static (Bus Bus, Route Route, BusSchedule Schedule, Seat[] Seats) SeedBasicScenario(
        AppDbContext db,
        string from = "Dhaka",
        string to = "Chittagong",
        int totalSeats = 40,
        DateOnly? journeyDate = null,
        decimal price = 500m)
    {
        var bus = new Bus(name: "AC Coach", companyName: "Green Line", totalSeats: totalSeats);
        db.Buses.Add(bus);

        var route = new Route(City.From(from), City.From(to), DistanceKm.From(250));
        db.Routes.Add(route);

        var date = journeyDate ?? DateOnly.FromDateTime(DateTime.UtcNow.Date.AddDays(1));
        var schedule = new BusSchedule(bus.Id, route.Id, date, new TimeOnly(10, 0), new TimeOnly(12, 0), price);
        db.BusSchedules.Add(schedule);

        // Create sequential seats with simple row assignment
        var seats = new List<Seat>(totalSeats);
        for (int i = 1; i <= totalSeats; i++)
        {
            seats.Add(new Seat(bus.Id, i, row: (i - 1) / 4));
        }
        db.Seats.AddRange(seats);

        db.SaveChanges();
        return (bus, route, schedule, seats.ToArray());
    }
}
