namespace BusReservationSystem.Domain.ValueObjects;

public sealed record City
{
    public string Name { get; }

    private City(string name)
    {
        Name = name;
    }

    public static City From(string name)
    {
        if (string.IsNullOrWhiteSpace(name))
            throw new ArgumentException("City name cannot be null or empty", nameof(name));
        var trimmed = name.Trim();
        if (trimmed.Length > 100)
            throw new ArgumentException("City name is too long (max 100)", nameof(name));
        return new City(trimmed);
    }

    public override string ToString() => Name;
}
