using BusReservationSystem.Domain.Common;
using BusReservationSystem.Domain.ValueObjects;

namespace BusReservationSystem.Domain.Entities;

public class Route : BaseEntity
{
    public City FromCity { get; private set; } = null!;
    public City ToCity { get; private set; } = null!;
    public DistanceKm DistanceKm { get; private set; }

    private Route() { }

    public Route(City fromCity, City toCity, DistanceKm distanceKm)
    {
        SetCities(fromCity, toCity);
        SetDistance(distanceKm);
        CreatedAt = DateTime.UtcNow;
    }

    public void SetCities(City fromCity, City toCity)
    {
        if (fromCity is null) throw new ArgumentNullException(nameof(fromCity));
        if (toCity is null) throw new ArgumentNullException(nameof(toCity));
        if (fromCity == toCity)
            throw new ArgumentException("FromCity and ToCity cannot be the same");
        FromCity = fromCity;
        ToCity = toCity;
        UpdatedAt = DateTime.UtcNow;
    }

    public void SetDistance(DistanceKm distanceKm)
    {
        DistanceKm = distanceKm;
        UpdatedAt = DateTime.UtcNow;
    }
}
