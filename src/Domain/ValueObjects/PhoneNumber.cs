using System.Text.RegularExpressions;

namespace BusReservationSystem.Domain.ValueObjects;

public sealed record PhoneNumber
{
    public string Value { get; }

    private PhoneNumber(string value)
    {
        Value = value;
    }

    public static PhoneNumber From(string value)
    {
        if (string.IsNullOrWhiteSpace(value))
            throw new ArgumentException("Phone number cannot be empty", nameof(value));

        var normalized = value.Trim();
        // Basic length check
        if (normalized.Length < 7 || normalized.Length > 20)
            throw new ArgumentException("Phone number length must be between 7 and 20 characters", nameof(value));

        // Light validation: allow digits, spaces, dashes, and leading +
        if (!Regex.IsMatch(normalized, "^[+]?[- 0-9]+$"))
            throw new ArgumentException("Phone number contains invalid characters", nameof(value));

        return new PhoneNumber(normalized);
    }

    public override string ToString() => Value;
}
