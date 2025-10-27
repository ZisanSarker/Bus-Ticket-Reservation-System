using BusReservationSystem.Domain.Entities;
using BusReservationSystem.Domain.ValueObjects;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace BusReservationSystem.Infrastructure.Data;

public static class DbSeeder
{
    public static async Task MigrateAndSeedAsync(this IServiceProvider services, CancellationToken cancellationToken = default)
    {
        using var scope = services.CreateScope();
        var logger = scope.ServiceProvider.GetRequiredService<ILoggerFactory>().CreateLogger("DbSeeder");
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

        await db.Database.MigrateAsync(cancellationToken);

        var hasBaseData = await db.Buses.AnyAsync(cancellationToken);

        if (!hasBaseData)
        {
            logger.LogInformation("Seeding initial data (buses, routes, and curated schedules)...");

            // Create buses with various operators - All buses have exactly 40 seats
            var busHT101 = new Bus("AC Business Class", "Hanif Enterprise", 40);
        var busEN202 = new Bus("Non-AC Hino", "Ena Transport", 40);
        var busDT303 = new Bus("AC Sleeper", "Desh Travels", 40);
        var busSH404 = new Bus("AC Business Class", "Shyamoli Paribahan", 40);
        var busGR505 = new Bus("AC Sleeper", "Green Line", 40);
        var busHT606 = new Bus("Non-AC Hino", "Hanif Enterprise", 40);
        var busEN707 = new Bus("AC Business Class", "Ena Transport", 40);
        var busDT808 = new Bus("Non-AC Hino", "Desh Travels", 40);
        var busSH909 = new Bus("AC Sleeper", "Shyamoli Paribahan", 40);
        var busGR010 = new Bus("Non-AC Hino", "Green Line", 40);
        var busHT111 = new Bus("AC Business Class", "Hanif Enterprise", 40);
        var busEN212 = new Bus("AC Sleeper", "Ena Transport", 40);
        var busDT313 = new Bus("Non-AC Hino", "Desh Travels", 40);
        var busSR414 = new Bus("AC Business Class", "Soudia Paribahan", 40);
        var busTR515 = new Bus("Non-AC Hino", "Tungipara Express", 40);
        var busSP616 = new Bus("AC Sleeper", "Saintmartin Paribahan", 40);

        var buses = new[] { busHT101, busEN202, busDT303, busSH404, busGR505, busHT606, busEN707, 
                            busDT808, busSH909, busGR010, busHT111, busEN212, busDT313, busSR414, 
                            busTR515, busSP616 };
            await db.Buses.AddRangeAsync(buses, cancellationToken);

                // Create seats for each bus
                // All buses have exactly 40 seats arranged in 10 rows (4 seats per row: 2-2 configuration)
                var allSeats = new List<Seat>();
                foreach (var bus in buses)
                {
                    for (int i = 1; i <= bus.TotalSeats; i++)
                    {
                        var row = (i - 1) / 4; // 4 seats per row (2-2 configuration)
                        allSeats.Add(new Seat(bus.Id, i, row));
                    }
                }
                await db.Seats.AddRangeAsync(allSeats, cancellationToken);

            // Create routes (base popular)
            var routeDhakaRajshahi = new Route(City.From("Dhaka"), City.From("Rajshahi"), DistanceKm.From(250));
            var routeDhakaChittagong = new Route(City.From("Dhaka"), City.From("Chittagong"), DistanceKm.From(240));
            var routeDhakaBarisal = new Route(City.From("Dhaka"), City.From("Barisal"), DistanceKm.From(200));
            var routeDhakaCoxsBazar = new Route(City.From("Dhaka"), City.From("Cox's Bazar"), DistanceKm.From(400));
            var routeDhakaSylhet = new Route(City.From("Dhaka"), City.From("Sylhet"), DistanceKm.From(244));

            var initialRoutes = new List<Route>
            {
                routeDhakaRajshahi, routeDhakaChittagong, routeDhakaBarisal, routeDhakaCoxsBazar, routeDhakaSylhet
            };

        // Bangladesh districts (English names aligned with typical usage in app)
        var allDistricts = new[]
        {
            // Dhaka Division (excluding Dhaka)
            "Gazipur", "Narayanganj", "Narsingdi", "Manikganj", "Munshiganj", "Kishoreganj", "Tangail", "Faridpur", "Gopalganj", "Madaripur", "Rajbari", "Shariatpur",
            // Chittagong Division (excluding Chittagong, Cox's Bazar)
            "Feni", "Lakshmipur", "Noakhali", "Chandpur", "Brahmanbaria", "Comilla", "Bandarban", "Rangamati", "Khagrachhari",
            // Rajshahi Division (excluding Rajshahi)
            "Naogaon", "Natore", "Chapai Nawabganj", "Pabna", "Sirajganj", "Bogura", "Joypurhat",
            // Khulna Division
            "Khulna", "Bagerhat", "Satkhira", "Jessore", "Magura", "Jhenaidah", "Chuadanga", "Kushtia", "Meherpur", "Narail",
            // Rangpur Division
            "Rangpur", "Kurigram", "Gaibandha", "Nilphamari", "Lalmonirhat", "Thakurgaon", "Panchagarh",
            // Barisal Division (excluding Barisal)
            "Bhola", "Jhalokathi", "Pirojpur", "Patuakhali", "Barguna",
            // Mymensingh Division
            "Mymensingh", "Jamalpur", "Netrokona", "Sherpur",
            // Sylhet Division (excluding Sylhet)
            "Moulvibazar", "Habiganj", "Sunamganj"
        };

        // helper to get approximate distance from Dhaka
        double ApproxDistance(string district)
        {
            return district switch
            {
                // ~nearby Dhaka
                "Gazipur" => 35,
                "Narayanganj" => 25,
                "Narsingdi" => 55,
                "Manikganj" => 60,
                "Munshiganj" => 40,
                "Kishoreganj" => 95,
                "Tangail" => 98,
                "Faridpur" => 120,
                "Gopalganj" => 160,
                "Madaripur" => 150,
                "Rajbari" => 140,
                "Shariatpur" => 140,
                // Chittagong div
                "Comilla" => 100,
                "Chandpur" => 110,
                "Brahmanbaria" => 120,
                "Feni" => 160,
                "Lakshmipur" => 180,
                "Noakhali" => 195,
                "Rangamati" => 310,
                "Bandarban" => 325,
                "Khagrachhari" => 266,
                // Rajshahi div (Rajshahi already seeded as 250)
                "Naogaon" => 270,
                "Natore" => 230,
                "Chapai Nawabganj" => 300,
                "Pabna" => 215,
                "Sirajganj" => 140,
                "Bogura" => 195,
                "Joypurhat" => 250,
                // Khulna div
                "Khulna" => 275,
                "Bagerhat" => 240,
                "Satkhira" => 290,
                "Jessore" => 240,
                "Magura" => 190,
                "Jhenaidah" => 205,
                "Chuadanga" => 220,
                "Kushtia" => 180,
                "Meherpur" => 230,
                "Narail" => 210,
                // Rangpur div
                "Rangpur" => 320,
                "Kurigram" => 420,
                "Gaibandha" => 280,
                "Nilphamari" => 370,
                "Lalmonirhat" => 360,
                "Thakurgaon" => 410,
                "Panchagarh" => 450,
                // Barisal div (Barisal already seeded as 200)
                "Bhola" => 300,
                "Jhalokathi" => 245,
                "Pirojpur" => 265,
                "Patuakhali" => 300,
                "Barguna" => 320,
                // Mymensingh div
                "Mymensingh" => 120,
                "Jamalpur" => 190,
                "Netrokona" => 175,
                "Sherpur" => 200,
                // Sylhet div (Sylhet already seeded as 244)
                "Moulvibazar" => 215,
                "Habiganj" => 190,
                "Sunamganj" => 285,
                _ => 200
            };
        }

            var existingToCities = new HashSet<string>(initialRoutes.Select(r => r.ToCity.Name));
            var dynamicRoutes = new List<Route>();
            foreach (var district in allDistricts)
            {
                if (existingToCities.Contains(district)) continue; // already seeded above
                var dist = DistanceKm.From(ApproxDistance(district));
                dynamicRoutes.Add(new Route(City.From("Dhaka"), City.From(district), dist));
                dynamicRoutes.Add(new Route(City.From(district), City.From("Dhaka"), dist));
            }

            await db.Routes.AddRangeAsync(initialRoutes.Concat(dynamicRoutes), cancellationToken);

            var tomorrow = DateOnly.FromDateTime(DateTime.UtcNow.Date.AddDays(1));

            // Base schedules for popular routes
            var schedules = new List<BusSchedule>
            {
            // Dhaka to Rajshahi trips
            new(busHT101.Id, routeDhakaRajshahi.Id, tomorrow, new TimeOnly(7, 30), new TimeOnly(13, 30), 1200, "Kallayanpur Counter", "Rajshahi University Gate"),
            new(busEN202.Id, routeDhakaRajshahi.Id, tomorrow, new TimeOnly(8, 0), new TimeOnly(14, 0), 900, "Mohakhali Counter", "Shiroil Bus Stand"),
            new(busDT303.Id, routeDhakaRajshahi.Id, tomorrow, new TimeOnly(9, 15), new TimeOnly(15, 0), 1500, "Kallayanpur Counter", "Rajshahi University Gate"),
            new(busSH404.Id, routeDhakaRajshahi.Id, tomorrow, new TimeOnly(10, 0), new TimeOnly(16, 0), 1300, "Gabtoli Terminal", "Shiroil Bus Stand"),
            new(busGR505.Id, routeDhakaRajshahi.Id, tomorrow, new TimeOnly(11, 30), new TimeOnly(17, 30), 1600, "Kallayanpur Counter", "Rajshahi University Gate"),
            new(busHT606.Id, routeDhakaRajshahi.Id, tomorrow, new TimeOnly(12, 0), new TimeOnly(18, 0), 950, "Gabtoli Terminal", "Shiroil Bus Stand"),
            new(busEN707.Id, routeDhakaRajshahi.Id, tomorrow, new TimeOnly(13, 0), new TimeOnly(19, 0), 1250, "Mohakhali Counter", "Rajshahi University Gate"),
            new(busDT808.Id, routeDhakaRajshahi.Id, tomorrow, new TimeOnly(14, 30), new TimeOnly(20, 30), 900, "Technical Counter", "Shiroil Bus Stand"),
            new(busSH909.Id, routeDhakaRajshahi.Id, tomorrow, new TimeOnly(15, 0), new TimeOnly(21, 0), 1550, "Kallayanpur Counter", "Rajshahi University Gate"),
            new(busGR010.Id, routeDhakaRajshahi.Id, tomorrow, new TimeOnly(16, 0), new TimeOnly(22, 0), 950, "Gabtoli Terminal", "Shiroil Bus Stand"),
            new(busHT111.Id, routeDhakaRajshahi.Id, tomorrow, new TimeOnly(17, 30), new TimeOnly(23, 30), 1200, "Kallayanpur Counter", "Rajshahi University Gate"),
            new(busEN212.Id, routeDhakaRajshahi.Id, tomorrow, new TimeOnly(18, 0), new TimeOnly(23, 59), 1500, "Mohakhali Counter", "Shiroil Bus Stand"),
            new(busDT313.Id, routeDhakaRajshahi.Id, tomorrow, new TimeOnly(19, 0), new TimeOnly(23, 59), 900, "Technical Counter", "Rajshahi University Gate"),

            // Dhaka to Sylhet trips
            new(busSR414.Id, routeDhakaSylhet.Id, tomorrow, new TimeOnly(7, 0), new TimeOnly(13, 0), 1300, "Sayedabad Counter", "Sylhet Ambarkhana"),
            new(busTR515.Id, routeDhakaSylhet.Id, tomorrow, new TimeOnly(9, 0), new TimeOnly(15, 0), 1100, "Mohakhali Counter", "Sylhet Kumargaon"),
            new(busSP616.Id, routeDhakaSylhet.Id, tomorrow, new TimeOnly(11, 0), new TimeOnly(17, 0), 1800, "Kallayanpur Counter", "Sylhet Ambarkhana"),

            // Other routes
            new(busHT606.Id, routeDhakaChittagong.Id, tomorrow, new TimeOnly(8, 0), new TimeOnly(14, 0), 1400, "Sayedabad Counter", "Chittagong Dampara"),
            new(busEN707.Id, routeDhakaBarisal.Id, tomorrow, new TimeOnly(9, 30), new TimeOnly(15, 30), 1100, "Gabtoli Terminal", "Barisal Nathullabad"),
            new(busDT808.Id, routeDhakaCoxsBazar.Id, tomorrow, new TimeOnly(10, 30), new TimeOnly(19, 0), 2000, "Fakirapool Counter", "Cox's Bazar Bus Terminal")
            };

        // Local helpers
        decimal ComputePrice(double km, string busName)
        {
            var basePerKm = 3.5m; // Non-AC baseline
            var factor = 1.0m;
            if (busName.Contains("AC Sleeper", StringComparison.OrdinalIgnoreCase)) factor = 5.0m / 3.5m; // ~1.43x
            else if (busName.Contains("AC Business", StringComparison.OrdinalIgnoreCase)) factor = 4.2m / 3.5m; // ~1.2x
            var price = (decimal)km * basePerKm * factor;
            var rounded = Math.Round(price / 50m, MidpointRounding.AwayFromZero) * 50m; // round to nearest 50
            return Math.Clamp(rounded, 300m, 2500m);
        }

        TimeOnly AddDurationSameDay(TimeOnly start, double km)
        {
            var hours = km / 45.0; // assume avg 45 km/h
            var mins = (int)Math.Round(hours * 60);
            var arrival = start.AddMinutes(mins);
            if (arrival <= start) return new TimeOnly(23, 59); // cap if overnight
            return arrival;
        }

            // Generate schedules for dynamic routes (2 per route)
            var busList = buses.ToList();
            var busIndex = 0;
            foreach (var r in dynamicRoutes)
            {
                var start1 = new TimeOnly(8, 0);
                var start2 = new TimeOnly(14, 0);
                var km = r.DistanceKm.Value;

                var bus1 = busList[busIndex % busList.Count]; busIndex++;
                var bus2 = busList[busIndex % busList.Count]; busIndex++;

                var price1 = ComputePrice(km, bus1.Name);
                var price2 = ComputePrice(km, bus2.Name);

                var arrival1 = AddDurationSameDay(start1, km);
                var arrival2 = AddDurationSameDay(start2, km);

                var startCounter = r.FromCity.Name == "Dhaka" ? "Gabtoli Terminal" : $"{r.FromCity.Name} Central Bus Terminal";
                var endCounter = r.ToCity.Name == "Dhaka" ? "Gabtoli Terminal" : $"{r.ToCity.Name} Central Bus Terminal";

                schedules.Add(new BusSchedule(bus1.Id, r.Id, tomorrow, start1, arrival1, price1, startCounter, endCounter));
                schedules.Add(new BusSchedule(bus2.Id, r.Id, tomorrow, start2, arrival2, price2, startCounter, endCounter));
            }

            await db.BusSchedules.AddRangeAsync(schedules, cancellationToken);

            await db.SaveChangesAsync(cancellationToken);

            logger.LogInformation("Base data seeding complete.");
        }

        // Ensure rolling schedules for next 7 days (including today)
        logger.LogInformation("Ensuring schedules for the upcoming days...");
        var allBuses = await db.Buses.AsNoTracking().ToListAsync(cancellationToken);
        var allRoutes = await db.Routes.AsNoTracking().ToListAsync(cancellationToken);
        if (allBuses.Count == 0 || allRoutes.Count == 0)
        {
            logger.LogWarning("Cannot ensure schedules: missing buses or routes.");
            return;
        }

        var roundRobin = 0;
        for (int day = 0; day < 7; day++)
        {
            var date = DateOnly.FromDateTime(DateTime.UtcNow.Date.AddDays(day));
            foreach (var r in allRoutes)
            {
                var exists = await db.BusSchedules.AsNoTracking().AnyAsync(
                    s => s.RouteId == r.Id && s.JourneyDate == date, cancellationToken);
                if (exists) continue;

                var start1 = new TimeOnly(8, 0);
                var start2 = new TimeOnly(14, 0);
                var km = r.DistanceKm.Value;

                var bus1 = allBuses[roundRobin % allBuses.Count]; roundRobin++;
                var bus2 = allBuses[roundRobin % allBuses.Count]; roundRobin++;

                decimal ComputePrice(double km2, string busName2)
                {
                    var basePerKm = 3.5m;
                    var factor = 1.0m;
                    if (busName2.Contains("AC Sleeper", StringComparison.OrdinalIgnoreCase)) factor = 5.0m / 3.5m;
                    else if (busName2.Contains("AC Business", StringComparison.OrdinalIgnoreCase)) factor = 4.2m / 3.5m;
                    var price = (decimal)km2 * basePerKm * factor;
                    var rounded = Math.Round(price / 50m, MidpointRounding.AwayFromZero) * 50m;
                    return Math.Clamp(rounded, 300m, 2500m);
                }

                TimeOnly AddDurationSameDayLocal(TimeOnly start, double km2)
                {
                    var hours = km2 / 45.0;
                    var mins = (int)Math.Round(hours * 60);
                    var arrival = start.AddMinutes(mins);
                    if (arrival <= start) return new TimeOnly(23, 59);
                    return arrival;
                }

                var price1 = ComputePrice(km, bus1.Name);
                var price2 = ComputePrice(km, bus2.Name);
                var arrival1 = AddDurationSameDayLocal(start1, km);
                var arrival2 = AddDurationSameDayLocal(start2, km);
                var startCounter = r.FromCity.Name == "Dhaka" ? "Gabtoli Terminal" : $"{r.FromCity.Name} Central Bus Terminal";
                var endCounter = r.ToCity.Name == "Dhaka" ? "Gabtoli Terminal" : $"{r.ToCity.Name} Central Bus Terminal";

                await db.BusSchedules.AddRangeAsync(new[]
                {
                    new BusSchedule(bus1.Id, r.Id, date, start1, arrival1, price1, startCounter, endCounter),
                    new BusSchedule(bus2.Id, r.Id, date, start2, arrival2, price2, startCounter, endCounter)
                }, cancellationToken);
            }
        }

        await db.SaveChangesAsync(cancellationToken);
        logger.LogInformation("Ensured schedules up to 7 days ahead.");
    }
}
