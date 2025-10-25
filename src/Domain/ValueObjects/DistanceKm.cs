namespace BusReservationSystem.Domain.ValueObjects;

public readonly record struct DistanceKm
{
    public double Value { get; }

    private DistanceKm(double value)
    {
        Value = value;
    }

    public static DistanceKm From(double value)
    {
        if (double.IsNaN(value) || double.IsInfinity(value))
            throw new ArgumentException("Distance must be a finite number", nameof(value));
        if (value < 0)
            throw new ArgumentOutOfRangeException(nameof(value), "Distance cannot be negative");
        if (value > 10000)
            throw new ArgumentOutOfRangeException(nameof(value), "Distance seems unrealistic (> 10,000 km)");
        return new DistanceKm(Math.Round(value, 2));
    }

    public override string ToString() => $"{Value} km";
}