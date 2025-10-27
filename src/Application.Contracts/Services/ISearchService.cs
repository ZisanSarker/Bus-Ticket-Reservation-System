using BusReservationSystem.Application.Contracts.Transport;

namespace BusReservationSystem.Application.Contracts.Services;

public interface ISearchService
{
    Task<List<AvailableBusDto>> SearchAvailableBusesAsync(string from, string to, DateTime journeyDate, CancellationToken cancellationToken = default);
    Task<DateOnly?> FindFirstAvailableDateAsync(string from, string to, DateOnly startDate, CancellationToken cancellationToken = default);
}
