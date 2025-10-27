using BusReservationSystem.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BusReservationSystem.Infrastructure.Data.Configurations;

public class SeatConfiguration : IEntityTypeConfiguration<Seat>
{
    public void Configure(EntityTypeBuilder<Seat> builder)
    {
        builder.ToTable("Seats");

        builder.HasKey(s => s.Id);

        builder.Property(s => s.BusId).IsRequired();
        builder.Property(s => s.SeatNumber).IsRequired();
        builder.Property(s => s.Row).IsRequired();
        builder.Property(s => s.Status).IsRequired();

        builder.Property(s => s.CreatedAt).IsRequired();
        builder.Property(s => s.UpdatedAt);

        builder.HasIndex(s => new { s.BusId, s.SeatNumber }).IsUnique();
        builder.HasIndex(s => s.BusId);
    }
}
