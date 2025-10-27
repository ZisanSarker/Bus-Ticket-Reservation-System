using BusReservationSystem.Domain.Common;

namespace BusReservationSystem.Domain.Entities;

public class Bus : BaseEntity
{
    public string Name { get; private set; } = null!;
    public string CompanyName { get; private set; } = null!;
    public int TotalSeats { get; private set; }

    private Bus() { }

    public Bus(string name, string companyName, int totalSeats)
    {
        SetName(name);
        SetCompanyName(companyName);
        SetTotalSeats(totalSeats);
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

    public void SetCompanyName(string companyName)
    {
        if (string.IsNullOrWhiteSpace(companyName))
            throw new ArgumentException("CompanyName cannot be empty", nameof(companyName));
        if (companyName.Length > 150) throw new ArgumentException("CompanyName too long (max 150)", nameof(companyName));
        CompanyName = companyName.Trim();
        UpdatedAt = DateTime.UtcNow;
    }

    public void SetTotalSeats(int totalSeats)
    {
        if (totalSeats <= 0) throw new ArgumentOutOfRangeException(nameof(totalSeats), "TotalSeats must be positive");
        if (totalSeats > 200) throw new ArgumentOutOfRangeException(nameof(totalSeats), "TotalSeats seems unrealistic (>200)");
        // Standard seat count is 40 (10 rows × 4 seats in 2-2 configuration)
        TotalSeats = totalSeats;
        UpdatedAt = DateTime.UtcNow;
    }
}
