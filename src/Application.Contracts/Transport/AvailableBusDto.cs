namespace BusReservationSystem.Application.Contracts.Transport;

public sealed record AvailableBusDto
{
    public Guid BusScheduleId { get; init; }
    public Guid BusId { get; init; }
    public string BusName { get; init; } = string.Empty;
    public string CompanyName { get; init; } = string.Empty;

    public string From { get; init; } = string.Empty;
    public string To { get; init; } = string.Empty;
    public string StartingCounter { get; init; } = string.Empty;
    public string ArrivalCounter { get; init; } = string.Empty;
    public DateOnly JourneyDate { get; init; }
    public TimeOnly StartTime { get; init; }
    public TimeOnly ArrivalTime { get; init; }
    public decimal Price { get; init; }

    public int TotalSeats { get; init; }
    public int SeatsLeft { get; init; }

    public int DurationMinutes { get; init; }
}
