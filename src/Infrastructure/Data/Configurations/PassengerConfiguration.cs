using BusReservationSystem.Domain.Entities;
using BusReservationSystem.Domain.ValueObjects;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace BusReservationSystem.Infrastructure.Data.Configurations;

public class PassengerConfiguration : IEntityTypeConfiguration<Passenger>
{
    public void Configure(EntityTypeBuilder<Passenger> builder)
    {
        builder.ToTable("Passengers");

        builder.HasKey(p => p.Id);

        builder.Property(p => p.Name)
            .HasMaxLength(100)
            .IsRequired();

        var phoneToString = new ValueConverter<PhoneNumber, string>(
            p => p.Value,
            s => PhoneNumber.From(s));

        builder.Property(p => p.MobileNumber)
            .HasConversion(phoneToString)
            .HasMaxLength(20)
            .IsRequired();

        builder.Property(p => p.CreatedAt).IsRequired();
        builder.Property(p => p.UpdatedAt);

        builder.HasIndex(p => p.MobileNumber);
    }
}
