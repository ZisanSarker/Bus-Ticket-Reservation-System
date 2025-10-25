using BusReservationSystem.Domain.Entities;
using BusReservationSystem.Domain.Enums;

namespace BusReservationSystem.Domain.Services;

public static class SeatStateTransitionService
{
    // Contract: allows only Available -> Booked -> Sold; throws on invalid transitions
    public static void Transition(Seat seat, SeatStatus target)
    {
        if (seat is null) throw new ArgumentNullException(nameof(seat));

        var current = seat.Status;
        if (current == target) return; // no-op

        switch (current)
        {
            case SeatStatus.Available:
                if (target is SeatStatus.Booked)
                {
                    seat.Status = SeatStatus.Booked;
                    seat.UpdatedAt = DateTime.UtcNow;
                    return;
                }
                break;
            case SeatStatus.Booked:
                if (target is SeatStatus.Sold)
                {
                    seat.Status = SeatStatus.Sold;
                    seat.UpdatedAt = DateTime.UtcNow;
                    return;
                }
                break;
            case SeatStatus.Sold:
                // terminal state
                break;
        }

        throw new InvalidOperationException($"Invalid seat status transition: {current} -> {target}");
    }
}
