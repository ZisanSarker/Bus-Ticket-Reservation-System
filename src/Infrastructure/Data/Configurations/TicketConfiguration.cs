using BusReservationSystem.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BusReservationSystem.Infrastructure.Data.Configurations;

public class TicketConfiguration : IEntityTypeConfiguration<Ticket>
{
    public void Configure(EntityTypeBuilder<Ticket> builder)
    {
        builder.ToTable("Tickets");

        builder.HasKey(t => t.Id);

        builder.Property(t => t.PassengerId).IsRequired();
        builder.Property(t => t.BusScheduleId).IsRequired();
        builder.Property(t => t.SeatId).IsRequired();
        builder.Property(t => t.BookingTime).IsRequired();

        builder.Property(t => t.CreatedAt).IsRequired();
        builder.Property(t => t.UpdatedAt);

        builder.HasIndex(t => new { t.BusScheduleId, t.SeatId }).IsUnique();

        builder.HasIndex(t => t.PassengerId);
    }
}
