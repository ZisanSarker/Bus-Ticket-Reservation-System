using BusReservationSystem.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BusReservationSystem.Infrastructure.Data.Configurations;

public class BusConfiguration : IEntityTypeConfiguration<Bus>
{
    public void Configure(EntityTypeBuilder<Bus> builder)
    {
        builder.ToTable("Buses");

        builder.HasKey(b => b.Id);

        builder.Property(b => b.Name)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(b => b.CompanyName)
            .IsRequired()
            .HasMaxLength(150);

        builder.Property(b => b.TotalSeats)
            .IsRequired();

        builder.Property(b => b.CreatedAt).IsRequired();
        builder.Property(b => b.UpdatedAt);

        builder.HasIndex(b => new { b.CompanyName, b.Name });
    }
}
