namespace BusReservationSystem.Application.Contracts.Transport;

public sealed record BookSeatInputDto
{
    public Guid BusScheduleId { get; init; }
    public string PassengerName { get; init; } = string.Empty;
    public string PassengerPhone { get; init; } = string.Empty;
    public IReadOnlyList<int> SeatNumbers { get; init; } = Array.Empty<int>();
}
