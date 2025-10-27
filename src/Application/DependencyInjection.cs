using System.Reflection;
using FluentValidation;
using Microsoft.Extensions.DependencyInjection;
using BusReservationSystem.Application.Contracts.Services;
using BusReservationSystem.Application.Services;

namespace BusReservationSystem.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddAutoMapper(typeof(DependencyInjection).Assembly);
        services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(typeof(DependencyInjection).Assembly));
        services.AddValidatorsFromAssembly(typeof(DependencyInjection).Assembly);
        services.AddScoped<IBookingService, BookingService>();
        services.AddScoped<ISearchService, SearchService>();

        return services;
    }
}
