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
        
        var normalized = NormalizeCityName(trimmed);
        return new City(normalized);
    }

    private static string NormalizeCityName(string name)
    {
        var words = name.Split(' ', StringSplitOptions.RemoveEmptyEntries);
        var normalized = string.Join(' ', words.Select(word => 
            char.ToUpper(word[0]) + word.Substring(1).ToLower()));
        return normalized;
    }

    public override string ToString() => Name;
}
