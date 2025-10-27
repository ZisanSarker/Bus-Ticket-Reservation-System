namespace BusReservationSystem.WebApi.Middleware;

/// <summary>
/// </summary>
public static class MiddlewareExtensions
{
    /// <summary>
    /// </summary>
    public static IApplicationBuilder UseGlobalExceptionHandling(this IApplicationBuilder app)
    {
        return app.UseMiddleware<GlobalExceptionHandlingMiddleware>();
    }
}
