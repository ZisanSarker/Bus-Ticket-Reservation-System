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
        // Add AutoMapper
        services.AddAutoMapper(Assembly.GetExecutingAssembly());

        // Add MediatR
        services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(Assembly.GetExecutingAssembly()));

        // Add FluentValidation
        services.AddValidatorsFromAssembly(Assembly.GetExecutingAssembly());

        // Application services
        services.AddScoped<ISearchService, SearchService>();
        services.AddScoped<IBookingService, BookingService>();

        return services;
    }
}
