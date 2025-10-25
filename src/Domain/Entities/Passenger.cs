using BusReservationSystem.Domain.Common;
using BusReservationSystem.Domain.ValueObjects;

namespace BusReservationSystem.Domain.Entities;

public class Passenger : BaseEntity
{
    public string Name { get; private set; } = null!;
    public PhoneNumber MobileNumber { get; private set; } = null!;

    private Passenger() { }

    public Passenger(string name, PhoneNumber mobileNumber)
    {
        SetName(name);
        SetMobileNumber(mobileNumber);
        CreatedAt = DateTime.UtcNow;
    }

    public void SetName(string name)
    {
        if (string.IsNullOrWhiteSpace(name))
            throw new ArgumentException("Name cannot be empty", nameof(name));
        if (name.Length > 100) throw new ArgumentException("Name too long (max 100)", nameof(name));
        Name = name.Trim();
        UpdatedAt = DateTime.UtcNow;
    }

    public void SetMobileNumber(PhoneNumber phone)
    {
        MobileNumber = phone ?? throw new ArgumentNullException(nameof(phone));
        UpdatedAt = DateTime.UtcNow;
    }
}
