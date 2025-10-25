using BusReservationSystem.Application.Contracts.Transport;

namespace BusReservationSystem.Application.Contracts.Services;

public interface IBookingService
{
    Task<SeatPlanDto> GetSeatPlanAsync(Guid busScheduleId, CancellationToken cancellationToken = default);
    Task<BookSeatResultDto> BookSeatAsync(BookSeatInputDto input, CancellationToken cancellationToken = default);
}
