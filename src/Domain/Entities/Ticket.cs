using BusReservationSystem.Domain.Common;

namespace BusReservationSystem.Domain.Entities;

public class Ticket : BaseEntity
{
    public Guid PassengerId { get; private set; }
    public Guid BusScheduleId { get; private set; }
    public Guid SeatId { get; private set; }

    public DateTime BookingTime { get; private set; }

    private Ticket() { }

    public Ticket(Guid passengerId, Guid busScheduleId, Guid seatId, DateTime? bookingTimeUtc = null)
    {
        if (passengerId == Guid.Empty) throw new ArgumentException("PassengerId cannot be empty", nameof(passengerId));
        if (busScheduleId == Guid.Empty) throw new ArgumentException("BusScheduleId cannot be empty", nameof(busScheduleId));
        if (seatId == Guid.Empty) throw new ArgumentException("SeatId cannot be empty", nameof(seatId));

        PassengerId = passengerId;
        BusScheduleId = busScheduleId;
        SeatId = seatId;
        BookingTime = (bookingTimeUtc ?? DateTime.UtcNow).ToUniversalTime();
        CreatedAt = DateTime.UtcNow;
    }
}
