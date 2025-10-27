using BusReservationSystem.Infrastructure.Data;
using BusReservationSystem.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace BusReservationSystem.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        services.AddDbContext<AppDbContext>(options =>
            options.UseNpgsql(
                configuration.GetConnectionString("DefaultConnection"),
                b => b.MigrationsAssembly(typeof(AppDbContext).Assembly.FullName)));

        services.AddScoped<Application.Contracts.Persistence.IBusRepository, BusRepository>();
        services.AddScoped<Application.Contracts.Persistence.IRouteRepository, RouteRepository>();
        services.AddScoped<Application.Contracts.Persistence.IPassengerRepository, PassengerRepository>();
        services.AddScoped<Application.Contracts.Persistence.ISeatRepository, SeatRepository>();
        services.AddScoped<Application.Contracts.Persistence.IBusScheduleRepository, BusScheduleRepository>();
        services.AddScoped<Application.Contracts.Persistence.ITicketRepository, TicketRepository>();
        services.AddScoped<Application.Contracts.Persistence.IUnitOfWork, UnitOfWork>();

        return services;
    }
}
