namespace BusReservationSystem.Application.Contracts.Transport;

public sealed record BookSeatResultDto
{
    public Guid BusScheduleId { get; init; }
    public IReadOnlyList<Guid> TicketIds { get; init; } = Array.Empty<Guid>();
    public IReadOnlyList<int> SeatNumbers { get; init; } = Array.Empty<int>();
    public decimal TotalPrice { get; init; }
}
