using BusReservationSystem.Domain.Entities;

namespace BusReservationSystem.Application.Contracts.Persistence;

public interface ITicketRepository
{
    Task<int> CountByScheduleAsync(Guid busScheduleId, CancellationToken cancellationToken = default);
    Task<IReadOnlySet<Guid>> GetSeatIdsBookedForScheduleAsync(Guid busScheduleId, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<Ticket>> GetByScheduleAndSeatIdsAsync(Guid busScheduleId, IEnumerable<Guid> seatIds, CancellationToken cancellationToken = default);
    Task AddRangeAsync(IEnumerable<Ticket> tickets, CancellationToken cancellationToken = default);
}
