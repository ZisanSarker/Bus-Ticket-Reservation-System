# Database Migrations

This folder contains an idempotent SQL script generated from the Entity Framework Core migrations.

- `migrations.sql`: Apply this to provision the database schema on any environment.

## Regenerate the script

```bash
# From repo root
dotnet tool restore
# Generate an idempotent SQL script from current migrations
DOTNET_SYSTEM_GLOBALIZATION_INVARIANT=1 \
  dotnet tool run dotnet-ef migrations script \
  --project src/Infrastructure/BusReservationSystem.Infrastructure.csproj \
  --startup-project src/WebApi/BusReservationSystem.WebApi.csproj \
  --output db/migrations.sql \
  --idempotent
```

Note: The API applies migrations automatically on startup (`DbSeeder.MigrateAndSeedAsync`).