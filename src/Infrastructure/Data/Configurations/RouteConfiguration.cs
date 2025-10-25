using BusReservationSystem.Domain.Entities;
using BusReservationSystem.Domain.ValueObjects;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace BusReservationSystem.Infrastructure.Data.Configurations;

public class RouteConfiguration : IEntityTypeConfiguration<Route>
{
    public void Configure(EntityTypeBuilder<Route> builder)
    {
        builder.ToTable("Routes");

        builder.HasKey(r => r.Id);

        // Value converters for City and DistanceKm
        var cityToString = new ValueConverter<City, string>(
            c => c.Name,
            s => City.From(s));

        var distanceToDouble = new ValueConverter<DistanceKm, double>(
            d => d.Value,
            v => DistanceKm.From(v));

        builder.Property(r => r.FromCity)
            .HasConversion(cityToString)
            .HasMaxLength(100)
            .IsRequired();

        builder.Property(r => r.ToCity)
            .HasConversion(cityToString)
            .HasMaxLength(100)
            .IsRequired();

        builder.Property(r => r.DistanceKm)
            .HasConversion(distanceToDouble)
            .IsRequired();

        builder.Property(r => r.CreatedAt).IsRequired();
        builder.Property(r => r.UpdatedAt);

        // Unique constraint to avoid duplicate routes
        builder.HasIndex(r => new { r.FromCity, r.ToCity }).IsUnique();
    }
}
