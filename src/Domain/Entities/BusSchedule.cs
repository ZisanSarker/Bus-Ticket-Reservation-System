using BusReservationSystem.Domain.Common;

namespace BusReservationSystem.Domain.Entities;

public class BusSchedule : BaseEntity
{
    public Guid BusId { get; private set; }
    public Guid RouteId { get; private set; }

    public DateOnly JourneyDate { get; private set; }
    public TimeOnly StartTime { get; private set; }
    public TimeOnly ArrivalTime { get; private set; }

    public decimal Price { get; private set; }

    private BusSchedule() { }

    public BusSchedule(Guid busId, Guid routeId, DateOnly journeyDate, TimeOnly startTime, TimeOnly arrivalTime, decimal price)
    {
        SetBus(busId);
        SetRoute(routeId);
        SetSchedule(journeyDate, startTime, arrivalTime);
        SetPrice(price);
        CreatedAt = DateTime.UtcNow;
    }

    public void SetBus(Guid busId)
    {
        if (busId == Guid.Empty) throw new ArgumentException("BusId cannot be empty", nameof(busId));
        BusId = busId;
        UpdatedAt = DateTime.UtcNow;
    }

    public void SetRoute(Guid routeId)
    {
        if (routeId == Guid.Empty) throw new ArgumentException("RouteId cannot be empty", nameof(routeId));
        RouteId = routeId;
        UpdatedAt = DateTime.UtcNow;
    }

    public void SetSchedule(DateOnly journeyDate, TimeOnly startTime, TimeOnly arrivalTime)
    {
        JourneyDate = journeyDate;
        StartTime = startTime;
        ArrivalTime = arrivalTime;
        // Basic validation: same-day arrival must be after start
        if (ArrivalTime <= StartTime)
        {
            // Allow overnight journeys only if arrival is on next day—domain rule could be extended later
            throw new ArgumentException("ArrivalTime must be after StartTime for same-day journeys");
        }
        UpdatedAt = DateTime.UtcNow;
    }

    public void SetPrice(decimal price)
    {
        if (price < 0) throw new ArgumentOutOfRangeException(nameof(price), "Price cannot be negative");
        if (price > 1_000_000m) throw new ArgumentOutOfRangeException(nameof(price), "Price seems unrealistic");
        Price = decimal.Round(price, 2);
        UpdatedAt = DateTime.UtcNow;
    }

    public TimeSpan Duration() => ArrivalTime - StartTime;
}
