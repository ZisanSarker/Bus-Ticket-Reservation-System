namespace BusReservationSystem.Application.Contracts.Exceptions;

public class SeatAlreadyBookedException : Exception
{
    public Guid BusScheduleId { get; }
    public IReadOnlyList<int> SeatNumbers { get; }

    public SeatAlreadyBookedException(Guid busScheduleId, IEnumerable<int> seatNumbers)
        : base($"One or more seats are already booked for schedule {busScheduleId}: {string.Join(", ", seatNumbers)}")
    {
        BusScheduleId = busScheduleId;
        SeatNumbers = seatNumbers.ToArray();
    }
}
