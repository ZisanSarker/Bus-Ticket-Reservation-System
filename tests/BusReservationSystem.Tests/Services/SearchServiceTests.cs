using BusReservationSystem.Application;
using BusReservationSystem.Application.Contracts.Persistence;
using BusReservationSystem.Domain.Entities;
using BusReservationSystem.Infrastructure.Data;
using BusReservationSystem.Tests.TestHelpers;
using Microsoft.Extensions.DependencyInjection;

namespace BusReservationSystem.Tests.Services;

public class SearchServiceTests
{
    [Fact]
    public async Task SearchAvailableBuses_Returns_Correct_Availability()
    {
        using var db = InMemoryDbContextFactory.CreateContext();
        var (bus, route, schedule, seats) = TestDataBuilder.SeedBasicScenario(db, totalSeats: 4, journeyDate: new DateOnly(2025, 10, 26), price: 750m);

        // Book two seats to reduce availability
        var passenger = new Passenger("Alice", Domain.ValueObjects.PhoneNumber.From("+8801712345678"));
        db.Passengers.Add(passenger);
        db.Tickets.AddRange(new Ticket(passenger.Id, schedule.Id, seats[0].Id), new Ticket(passenger.Id, schedule.Id, seats[1].Id));
        await db.SaveChangesAsync();

    var services = new ServiceCollection();
    services.AddApplication();
    services.AddScoped<IRouteRepository>(_ => new TestRouteRepository(db));
    services.AddScoped<IBusScheduleRepository>(_ => new TestBusScheduleRepository(db));
    services.AddScoped<IBusRepository>(_ => new TestBusRepository(db));
    services.AddScoped<ITicketRepository>(_ => new TestTicketRepository(db));
    var provider = services.BuildServiceProvider();
    var sut = provider.GetRequiredService<BusReservationSystem.Application.Contracts.Services.ISearchService>();

        var results = await sut.SearchAvailableBusesAsync("Dhaka", "Chittagong", new DateTime(2025, 10, 26));

        Assert.Single(results);
        var available = results[0];
        Assert.Equal(schedule.Id, available.BusScheduleId);
        Assert.Equal(bus.Id, available.BusId);
        Assert.Equal("Dhaka", available.From);
        Assert.Equal("Chittagong", available.To);
        Assert.Equal(4, available.TotalSeats);
        Assert.Equal(2, available.SeatsLeft);
        Assert.Equal(750m, available.Price);
        Assert.Equal(schedule.JourneyDate, available.JourneyDate);
        Assert.Equal(schedule.StartTime, available.StartTime);
        Assert.Equal(schedule.ArrivalTime, available.ArrivalTime);
    }

}
