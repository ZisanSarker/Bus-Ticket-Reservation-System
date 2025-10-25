using BusReservationSystem.Domain.Common;
using BusReservationSystem.Domain.Enums;

namespace BusReservationSystem.Domain.Entities;

public class Seat : BaseEntity
{
    public Guid BusId { get; private set; }
    public int SeatNumber { get; private set; }
    public int Row { get; private set; }
    public SeatStatus Status { get; internal set; } = SeatStatus.Available; // internal setter for domain service

    private Seat() { }

    public Seat(Guid busId, int seatNumber, int row)
    {
        if (busId == Guid.Empty) throw new ArgumentException("BusId cannot be empty", nameof(busId));
        if (seatNumber <= 0) throw new ArgumentOutOfRangeException(nameof(seatNumber), "SeatNumber must be positive");
        if (row < 0) throw new ArgumentOutOfRangeException(nameof(row), "Row cannot be negative");

        BusId = busId;
        SeatNumber = seatNumber;
        Row = row;
        Status = SeatStatus.Available;
        CreatedAt = DateTime.UtcNow;
    }

    public void SetRow(int row)
    {
        if (row < 0) throw new ArgumentOutOfRangeException(nameof(row));
        Row = row;
        UpdatedAt = DateTime.UtcNow;
    }
}
