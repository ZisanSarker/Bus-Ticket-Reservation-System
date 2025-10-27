namespace BusReservationSystem.Application.Contracts.Transport;

public sealed record SeatPlanDto
{
    public Guid BusScheduleId { get; init; }
    public Guid BusId { get; init; }
    public int TotalSeats { get; init; }
    public IReadOnlyList<SeatDto> Seats { get; init; } = Array.Empty<SeatDto>();
    public IReadOnlyList<RouteStopDto> BoardingPoints { get; init; } = Array.Empty<RouteStopDto>();
    public IReadOnlyList<RouteStopDto> DroppingPoints { get; init; } = Array.Empty<RouteStopDto>();
    public decimal BaseFare { get; init; }
    public decimal ServiceCharge { get; init; }
}

public sealed record SeatDto
{
    public Guid SeatId { get; init; }
    public int SeatNumber { get; init; }
    public int Row { get; init; }
    public bool IsBooked { get; init; }
    public bool IsBlocked { get; init; }
    public bool IsSold { get; init; }
}

public sealed record RouteStopDto
{
    public Guid StopId { get; init; }
    public string StopName { get; init; } = string.Empty;
    public string Time { get; init; } = string.Empty;
    public int Sequence { get; init; }
}
