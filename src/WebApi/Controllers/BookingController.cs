using BusReservationSystem.Application.Contracts.Services;
using BusReservationSystem.Application.Contracts.Transport;
using Microsoft.AspNetCore.Mvc;

namespace BusReservationSystem.WebApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BookingController : ControllerBase
{
    private readonly IBookingService _bookingService;
    private readonly ILogger<BookingController> _logger;

    public BookingController(IBookingService bookingService, ILogger<BookingController> logger)
    {
        _bookingService = bookingService;
        _logger = logger;
    }

    /// <summary>
    /// Get seat plan for a specific bus schedule
    /// </summary>
    [HttpGet("seatplan/{busScheduleId:guid}")]
    [ProducesResponseType(typeof(SeatPlanDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<SeatPlanDto>> GetSeatPlan(
        Guid busScheduleId,
        CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Fetching seat plan for schedule {ScheduleId}", busScheduleId);

        var seatPlan = await _bookingService.GetSeatPlanAsync(busScheduleId, cancellationToken);

        return Ok(seatPlan);
    }

    /// <summary>
    /// Book seats for a bus schedule
    /// </summary>
    [HttpPost("book")]
    [ProducesResponseType(typeof(BookSeatResultDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    public async Task<ActionResult<BookSeatResultDto>> BookSeat(
        [FromBody] BookSeatInputDto input,
        CancellationToken cancellationToken = default)
    {
        _logger.LogInformation(
            "Booking {SeatCount} seat(s) for schedule {ScheduleId} - Passenger: {PassengerName}",
            input.SeatNumbers?.Count ?? 0,
            input.BusScheduleId,
            input.PassengerName);

        var result = await _bookingService.BookSeatAsync(input, cancellationToken);

        _logger.LogInformation(
            "Successfully booked seats {SeatNumbers} - Tickets: {TicketIds}",
            string.Join(", ", result.SeatNumbers),
            string.Join(", ", result.TicketIds));

        return Ok(result);
    }
}
