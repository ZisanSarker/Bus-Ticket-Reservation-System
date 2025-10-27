using BusReservationSystem.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BusReservationSystem.Infrastructure.Data.Configurations;

public class BusScheduleConfiguration : IEntityTypeConfiguration<BusSchedule>
{
    public void Configure(EntityTypeBuilder<BusSchedule> builder)
    {
        builder.ToTable("BusSchedules");

        builder.HasKey(s => s.Id);

        builder.Property(s => s.BusId).IsRequired();
        builder.Property(s => s.RouteId).IsRequired();
        builder.Property(s => s.JourneyDate).HasColumnType("date").IsRequired();
        builder.Property(s => s.StartTime).HasColumnType("time").IsRequired();
        builder.Property(s => s.ArrivalTime).HasColumnType("time").IsRequired();
        builder.Property(s => s.Price).HasColumnType("numeric(10,2)").IsRequired();
        builder.Property(s => s.StartingCounter).HasMaxLength(200).IsRequired();
        builder.Property(s => s.ArrivalCounter).HasMaxLength(200).IsRequired();

        builder.Property(s => s.CreatedAt).IsRequired();
        builder.Property(s => s.UpdatedAt);

        builder.HasIndex(s => new { s.RouteId, s.JourneyDate });
        builder.HasIndex(s => s.BusId);
    }
}
