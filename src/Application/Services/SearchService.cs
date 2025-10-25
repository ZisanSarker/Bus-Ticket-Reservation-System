using BusReservationSystem.Application.Contracts.Persistence;
using BusReservationSystem.Application.Contracts.Services;
using BusReservationSystem.Application.Contracts.Transport;
using BusReservationSystem.Domain.Entities;

namespace BusReservationSystem.Application.Services;

internal sealed class SearchService : ISearchService
{
    private readonly IRouteRepository _routeRepo;
    private readonly IBusScheduleRepository _scheduleRepo;
    private readonly IBusRepository _busRepo;
    private readonly ITicketRepository _ticketRepo;

    public SearchService(
        IRouteRepository routeRepo,
        IBusScheduleRepository scheduleRepo,
        IBusRepository busRepo,
        ITicketRepository ticketRepo)
    {
        _routeRepo = routeRepo;
        _scheduleRepo = scheduleRepo;
        _busRepo = busRepo;
        _ticketRepo = ticketRepo;
    }

    public async Task<List<AvailableBusDto>> SearchAvailableBusesAsync(string from, string to, DateTime journeyDate, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(from)) throw new ArgumentException("From cannot be empty", nameof(from));
        if (string.IsNullOrWhiteSpace(to)) throw new ArgumentException("To cannot be empty", nameof(to));

        var normalizedFrom = from.Trim();
        var normalizedTo = to.Trim();
        var dateOnly = DateOnly.FromDateTime(journeyDate.Date);

        var routes = await _routeRepo.GetByCitiesAsync(normalizedFrom, normalizedTo, cancellationToken);
        if (routes.Count == 0)
            return new List<AvailableBusDto>();

        var routeIds = routes.Select(r => r.Id).ToArray();
        var schedules = await _scheduleRepo.GetByRouteIdsAndDateAsync(routeIds, dateOnly, cancellationToken);

        var results = new List<AvailableBusDto>(schedules.Count);
        foreach (var s in schedules)
        {
            var bus = await _busRepo.GetByIdAsync(s.BusId, cancellationToken);
            if (bus is null) continue; // or skip invalid

            var bookedCount = await _ticketRepo.CountByScheduleAsync(s.Id, cancellationToken);
            var seatsLeft = Math.Max(0, bus.TotalSeats - bookedCount);

            results.Add(new AvailableBusDto
            {
                BusScheduleId = s.Id,
                BusId = s.BusId,
                BusName = bus.Name,
                CompanyName = bus.CompanyName,
                From = routes.First(r => r.Id == s.RouteId).FromCity.ToString(),
                To = routes.First(r => r.Id == s.RouteId).ToCity.ToString(),
                JourneyDate = s.JourneyDate,
                StartTime = s.StartTime,
                ArrivalTime = s.ArrivalTime,
                Price = s.Price,
                TotalSeats = bus.TotalSeats,
                SeatsLeft = seatsLeft,
                DurationMinutes = (int)(s.Duration().TotalMinutes)
            });
        }

        return results
            .OrderBy(r => r.StartTime)
            .ThenBy(r => r.Price)
            .ToList();
    }
}
