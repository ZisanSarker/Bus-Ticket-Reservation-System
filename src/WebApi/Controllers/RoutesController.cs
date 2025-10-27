using BusReservationSystem.Application.Contracts.Persistence;
using Microsoft.AspNetCore.Mvc;

namespace BusReservationSystem.WebApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RoutesController : ControllerBase
{
    private readonly IRouteRepository _routeRepository;
    private readonly ILogger<RoutesController> _logger;

    public RoutesController(IRouteRepository routeRepository, ILogger<RoutesController> logger)
    {
        _routeRepository = routeRepository;
        _logger = logger;
    }

    /// <summary>
    /// Returns a distinct, alphabetically sorted list of all city names present in routes (from/to)
    /// </summary>
    [HttpGet("cities")]
    [ProducesResponseType(typeof(List<string>), StatusCodes.Status200OK)]
    public async Task<ActionResult<List<string>>> GetCities(CancellationToken cancellationToken = default)
    {
        var cities = await _routeRepository.GetAllCitiesAsync(cancellationToken);
        _logger.LogInformation("Returning {Count} cities", cities.Count);
        return Ok(cities);
    }
}
