using BusReservationSystem.Application.Contracts.Services;
using BusReservationSystem.Application.Contracts.Transport;
using Microsoft.AspNetCore.Mvc;

namespace BusReservationSystem.WebApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SearchController : ControllerBase
{
    private readonly ISearchService _searchService;
    private readonly ILogger<SearchController> _logger;

    public SearchController(ISearchService searchService, ILogger<SearchController> logger)
    {
        _searchService = searchService;
        _logger = logger;
    }

    /// <summary>
    /// Search for available buses based on route and date
    /// </summary>
    [HttpGet]
    [ProducesResponseType(typeof(List<AvailableBusDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<List<AvailableBusDto>>> SearchAvailableBuses(
        [FromQuery] string from,
        [FromQuery] string to,
        [FromQuery] DateTime journeyDate,
        CancellationToken cancellationToken = default)
    {
        _logger.LogInformation(
            "Searching for buses from {From} to {To} on {JourneyDate}", 
            from, to, journeyDate.Date);

        if (string.IsNullOrWhiteSpace(from))
        {
            return BadRequest(new { error = "From parameter is required" });
        }

        if (string.IsNullOrWhiteSpace(to))
        {
            return BadRequest(new { error = "To parameter is required" });
        }

        if (journeyDate.Date < DateTime.Today)
        {
            return BadRequest(new { error = "Journey date cannot be in the past" });
        }

        var results = await _searchService.SearchAvailableBusesAsync(
            from, to, journeyDate, cancellationToken);

        _logger.LogInformation("Found {Count} available buses", results.Count);

        return Ok(results);
    }

    /// <summary>
    /// Get the earliest available date with schedules for the given route, on or after the specified start date.
    /// </summary>
    [HttpGet("first-available-date")]
    [ProducesResponseType(typeof(object), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult> GetFirstAvailableDate(
        [FromQuery] string from,
        [FromQuery] string to,
        [FromQuery] DateTime? startDate,
        CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(from)) return BadRequest(new { error = "From parameter is required" });
        if (string.IsNullOrWhiteSpace(to)) return BadRequest(new { error = "To parameter is required" });

        var start = DateOnly.FromDateTime((startDate ?? DateTime.Today).Date);
        var first = await _searchService.FindFirstAvailableDateAsync(from, to, start, cancellationToken);
        if (first is null) return NotFound();
        return Ok(new { date = first });
    }
}
