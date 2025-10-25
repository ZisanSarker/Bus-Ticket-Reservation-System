using BusReservationSystem.Application.Contracts.Exceptions;
using BusReservationSystem.Application.Contracts.Persistence;
using BusReservationSystem.Application.Contracts.Services;
using BusReservationSystem.Application.Contracts.Transport;
using BusReservationSystem.Domain.Entities;
using BusReservationSystem.Domain.ValueObjects;

namespace BusReservationSystem.Application.Services;

internal sealed class BookingService : IBookingService
{
    private readonly IBusScheduleRepository _scheduleRepo;
    private readonly IBusRepository _busRepo;
    private readonly ISeatRepository _seatRepo;
    private readonly ITicketRepository _ticketRepo;
    private readonly IPassengerRepository _passengerRepo;
    private readonly IUnitOfWork _uow;

    public BookingService(
        IBusScheduleRepository scheduleRepo,
        IBusRepository busRepo,
        ISeatRepository seatRepo,
        ITicketRepository ticketRepo,
        IPassengerRepository passengerRepo,
        IUnitOfWork uow)
    {
        _scheduleRepo = scheduleRepo;
        _busRepo = busRepo;
        _seatRepo = seatRepo;
        _ticketRepo = ticketRepo;
        _passengerRepo = passengerRepo;
        _uow = uow;
    }

    public async Task<SeatPlanDto> GetSeatPlanAsync(Guid busScheduleId, CancellationToken cancellationToken = default)
    {
        var schedule = await _scheduleRepo.GetByIdAsync(busScheduleId, cancellationToken)
                       ?? throw new NotFoundException("BusSchedule", busScheduleId.ToString());

        var bus = await _busRepo.GetByIdAsync(schedule.BusId, cancellationToken)
                  ?? throw new NotFoundException("Bus", schedule.BusId.ToString());

        var seats = await _seatRepo.GetByBusIdAsync(bus.Id, cancellationToken);
        var bookedSeatIds = await _ticketRepo.GetSeatIdsBookedForScheduleAsync(schedule.Id, cancellationToken);

        var seatDtos = seats
            .OrderBy(s => s.SeatNumber)
            .Select(s => new SeatDto
            {
                SeatId = s.Id,
                SeatNumber = s.SeatNumber,
                Row = s.Row,
                IsBooked = bookedSeatIds.Contains(s.Id)
            })
            .ToList();

        return new SeatPlanDto
        {
            BusScheduleId = schedule.Id,
            BusId = bus.Id,
            TotalSeats = bus.TotalSeats,
            Seats = seatDtos
        };
    }

    public async Task<BookSeatResultDto> BookSeatAsync(BookSeatInputDto input, CancellationToken cancellationToken = default)
    {
        if (input is null) throw new ArgumentNullException(nameof(input));
        if (input.SeatNumbers is null || input.SeatNumbers.Count == 0)
            throw new ValidationException("At least one seat number must be provided");

        var schedule = await _scheduleRepo.GetByIdAsync(input.BusScheduleId, cancellationToken)
                       ?? throw new NotFoundException("BusSchedule", input.BusScheduleId.ToString());

        var bus = await _busRepo.GetByIdAsync(schedule.BusId, cancellationToken)
                  ?? throw new NotFoundException("Bus", schedule.BusId.ToString());

        // Validate seats exist
        var requestedNumbers = input.SeatNumbers.Select(n => n).Distinct().OrderBy(n => n).ToArray();
        var seats = await _seatRepo.GetByBusIdAndNumbersAsync(bus.Id, requestedNumbers, cancellationToken);
        if (seats.Count != requestedNumbers.Length)
        {
            var foundNumbers = seats.Select(s => s.SeatNumber).ToHashSet();
            var missing = requestedNumbers.Where(n => !foundNumbers.Contains(n));
            throw new ValidationException($"One or more seat numbers are invalid: {string.Join(", ", missing)}");
        }

        var seatIdByNumber = seats.ToDictionary(s => s.SeatNumber, s => s.Id);

        // First availability check before entering transaction (fast-fail)
        var existingForSeats = await _ticketRepo.GetByScheduleAndSeatIdsAsync(schedule.Id, seatIdByNumber.Values, cancellationToken);
        if (existingForSeats.Count > 0)
        {
            var alreadyBookedNumbers = existingForSeats
                .Select(t => seats.First(s => s.Id == t.SeatId).SeatNumber)
                .OrderBy(x => x)
                .ToArray();
            throw new SeatAlreadyBookedException(schedule.Id, alreadyBookedNumbers);
        }

        var ticketIds = new List<Guid>(requestedNumbers.Length);

        await _uow.ExecuteInTransactionAsync(async ct =>
        {
            // Re-check inside transaction to avoid race conditions
            var existingInside = await _ticketRepo.GetByScheduleAndSeatIdsAsync(schedule.Id, seatIdByNumber.Values, ct);
            if (existingInside.Count > 0)
            {
                var alreadyBookedNumbers = existingInside
                    .Select(t => seats.First(s => s.Id == t.SeatId).SeatNumber)
                    .OrderBy(x => x)
                    .ToArray();
                throw new SeatAlreadyBookedException(schedule.Id, alreadyBookedNumbers);
            }

            // Create passenger
            var passenger = new Passenger(input.PassengerName, PhoneNumber.From(input.PassengerPhone));
            await _passengerRepo.AddAsync(passenger, ct);

            // Create tickets
            var tickets = requestedNumbers
                .Select(num => new Ticket(passenger.Id, schedule.Id, seatIdByNumber[num], DateTime.UtcNow))
                .ToList();

            await _ticketRepo.AddRangeAsync(tickets, ct);
            ticketIds.AddRange(tickets.Select(t => t.Id));
        }, cancellationToken);

        var totalPrice = schedule.Price * requestedNumbers.Length;
        return new BookSeatResultDto
        {
            BusScheduleId = schedule.Id,
            TicketIds = ticketIds,
            SeatNumbers = requestedNumbers,
            TotalPrice = totalPrice
        };
    }
}
