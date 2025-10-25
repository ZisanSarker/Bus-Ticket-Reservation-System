using BusReservationSystem.Application;
using BusReservationSystem.Application.Contracts.Exceptions;
using BusReservationSystem.Application.Contracts.Persistence;
using BusReservationSystem.Application.Contracts.Services;
using BusReservationSystem.Application.Contracts.Transport;
using BusReservationSystem.Domain.Entities;
using BusReservationSystem.Infrastructure.Data;
using BusReservationSystem.Tests.TestHelpers;
using Microsoft.Extensions.DependencyInjection;

namespace BusReservationSystem.Tests.Services;

public class BookingServiceTests
{
    [Fact]
    public async Task BookSeat_Succeeds_For_Available_Seat()
    {
        // Arrange
        using var db = InMemoryDbContextFactory.CreateContext();
        var (_, _, schedule, seats) = TestDataBuilder.SeedBasicScenario(db, totalSeats: 4, journeyDate: new DateOnly(2025, 10, 26), price: 800m);

        var services = BuildServiceProvider(db);
        var sut = services.GetRequiredService<IBookingService>();

        var input = new BookSeatInputDto
        {
            BusScheduleId = schedule.Id,
            PassengerName = "Bob",
            PassengerPhone = "+8801812345678",
            SeatNumbers = new[] { 3 }
        };

        // Act
        var result = await sut.BookSeatAsync(input);

        // Assert
        Assert.Equal(schedule.Id, result.BusScheduleId);
        Assert.Single(result.TicketIds);
        Assert.Single(result.SeatNumbers);
        Assert.Equal(3, result.SeatNumbers[0]);
        Assert.Equal(800m, result.TotalPrice);

        // Verify seat shows booked via seat plan
        var seatPlan = await sut.GetSeatPlanAsync(schedule.Id);
        var seat3 = seatPlan.Seats.Single(s => s.SeatNumber == 3);
        Assert.True(seat3.IsBooked);

        // Verify ticket persisted
        Assert.Equal(1, db.Tickets.Count(t => t.BusScheduleId == schedule.Id && t.SeatId == seats[2].Id));
    }

    [Fact]
    public async Task BookSeat_Throws_When_Seat_Already_Booked()
    {
        // Arrange
        using var db = InMemoryDbContextFactory.CreateContext();
        var (_, _, schedule, seats) = TestDataBuilder.SeedBasicScenario(db, totalSeats: 4, journeyDate: new DateOnly(2025, 10, 26));

        var passenger = new Passenger("Alice", Domain.ValueObjects.PhoneNumber.From("+8801712345678"));
        db.Passengers.Add(passenger);
        db.Tickets.Add(new Ticket(passenger.Id, schedule.Id, seats[0].Id)); // Seat 1 booked
        await db.SaveChangesAsync();

        var services = BuildServiceProvider(db);
        var sut = services.GetRequiredService<IBookingService>();

        var input = new BookSeatInputDto
        {
            BusScheduleId = schedule.Id,
            PassengerName = "Carol",
            PassengerPhone = "+8801912345678",
            SeatNumbers = new[] { 1 }
        };

        // Act + Assert
        var ex = await Assert.ThrowsAsync<SeatAlreadyBookedException>(() => sut.BookSeatAsync(input));
        Assert.Equal(schedule.Id, ex.BusScheduleId);
        Assert.Contains(1, ex.SeatNumbers);
    }

    [Fact]
    public async Task Seat_Status_Toggles_After_Booking_And_Cancellation()
    {
        // Arrange
        using var db = InMemoryDbContextFactory.CreateContext();
        var (_, _, schedule, seats) = TestDataBuilder.SeedBasicScenario(db, totalSeats: 4, journeyDate: new DateOnly(2025, 10, 26));

        var services = BuildServiceProvider(db);
        var sut = services.GetRequiredService<IBookingService>();

        // Initially seat 2 is available
        var beforePlan = await sut.GetSeatPlanAsync(schedule.Id);
        Assert.False(beforePlan.Seats.Single(s => s.SeatNumber == 2).IsBooked);

        // Act: book seat 2
        var input = new BookSeatInputDto
        {
            BusScheduleId = schedule.Id,
            PassengerName = "Dan",
            PassengerPhone = "+8801712345670",
            SeatNumbers = new[] { 2 }
        };
        await sut.BookSeatAsync(input);

        // Assert: now seat 2 is booked
        var afterBooking = await sut.GetSeatPlanAsync(schedule.Id);
        Assert.True(afterBooking.Seats.Single(s => s.SeatNumber == 2).IsBooked);

        // Simulate cancellation by deleting the ticket
        var ticket = db.Tickets.Single(t => t.BusScheduleId == schedule.Id && t.SeatId == seats[1].Id);
        db.Tickets.Remove(ticket);
        await db.SaveChangesAsync();

        var afterCancellation = await sut.GetSeatPlanAsync(schedule.Id);
        Assert.False(afterCancellation.Seats.Single(s => s.SeatNumber == 2).IsBooked);
    }

    private static ServiceProvider BuildServiceProvider(AppDbContext db)
    {
        var services = new ServiceCollection();
        services.AddApplication();
        services.AddScoped<IBusScheduleRepository>(_ => new TestBusScheduleRepository(db));
        services.AddScoped<IBusRepository>(_ => new TestBusRepository(db));
        services.AddScoped<ISeatRepository>(_ => new TestSeatRepository(db));
        services.AddScoped<ITicketRepository>(_ => new TestTicketRepository(db));
        services.AddScoped<IPassengerRepository>(_ => new TestPassengerRepository(db));
        services.AddScoped<IUnitOfWork>(_ => new TestUnitOfWork(db));
        return services.BuildServiceProvider();
    }
}
