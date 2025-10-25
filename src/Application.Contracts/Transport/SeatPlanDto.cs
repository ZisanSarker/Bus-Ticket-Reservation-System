namespace BusReservationSystem.Application.Contracts.Transport;

public sealed record SeatPlanDto
{
    public Guid BusScheduleId { get; init; }
    public Guid BusId { get; init; }
    public int TotalSeats { get; init; }
    public IReadOnlyList<SeatDto> Seats { get; init; } = Array.Empty<SeatDto>();
}

public sealed record SeatDto
{
    public Guid SeatId { get; init; }
    public int SeatNumber { get; init; }
    public int Row { get; init; }
    public bool IsBooked { get; init; }
}
