# Bus Reservation System

A modern bus ticket reservation system built with **.NET 9** and **Angular 20** following **Clean Architecture** principles.

## 🏗️ Architecture

This solution follows Clean Architecture with clear separation of concerns:

```
/src
  ├── Domain                    # Core business entities and domain logic
  ├── Application              # Application business logic, CQRS handlers
  ├── Application.Contracts    # DTOs, interfaces, and contracts
  ├── Infrastructure           # Data access, EF Core, external services
  ├── WebApi                   # ASP.NET Core Web API
  └── ClientApp                # Angular frontend application
/tests
  └── BusReservationSystem.Tests  # Unit and integration tests
```

## 🚀 Technology Stack

### Backend
- **.NET 9** - Latest .NET framework
- **ASP.NET Core Web API** - RESTful API
- **Entity Framework Core 9** - ORM with PostgreSQL provider
- **PostgreSQL** - Relational database
- **MediatR** - CQRS pattern implementation
- **AutoMapper** - Object-to-object mapping
- **FluentValidation** - Input validation
- **xUnit** - Unit testing framework

### Frontend
- **Angular 20** - Latest Angular framework
- **TypeScript** - Type-safe JavaScript
- **Angular Router** - Client-side routing
- **HttpClient** - HTTP communication
- **TailwindCSS** - Utility-first CSS framework
- **RxJS** - Reactive programming

## 📋 Prerequisites

- [.NET 9 SDK](https://dotnet.microsoft.com/download/dotnet/9.0)
- [Node.js 18+](https://nodejs.org/)
- PostgreSQL 14+ (local) or Docker

## 🛠️ Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd Bus-Ticket-Reservation-System
```

### 2. Database (choose one)

Option A — Docker (recommended)

```bash
# Start PostgreSQL in Docker
docker compose up -d
```

Option B — Local PostgreSQL

Update the connection string in `src/WebApi/appsettings.json` to match your local setup:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Port=5432;Database=BusReservationDb;Username=your_username;Password=your_password"
  }
}
```

### 3. Apply database migrations

Migrations are applied automatically on API startup. Alternatively, you can apply them manually:

```bash
# Idempotent SQL script is available at db/migrations.sql
dotnet tool restore
dotnet tool run dotnet-ef database update --project src/Infrastructure/BusReservationSystem.Infrastructure.csproj --startup-project src/WebApi/BusReservationSystem.WebApi.csproj
```

### 4. Run the Backend API

Run on HTTP (avoids dev HTTPS cert issues):

```bash
# From repo root
ASPNETCORE_URLS=http://localhost:5000 dotnet run --project src/WebApi/BusReservationSystem.WebApi.csproj
```

Swagger UI: http://localhost:5000
Health: http://localhost:5000/api/health

### 5. Run the Frontend

```bash
cd src/ClientApp
npm install
npm start
```

The Angular app will be available at http://localhost:4200 and is configured to call the API at http://localhost:5000/api (see `src/ClientApp/src/environments/environment.ts`).

> CORS is enabled for http://localhost:4200 in the API (`Program.cs`).

### 6. End-to-end flow (Search → Seat Plan → Booking)

1. Open http://localhost:4200
2. Use the Search form (examples: From "Dhaka" → To "Chittagong"; Journey Date: tomorrow)
3. Pick a result to view Seat Plan
4. Select one or more seats and proceed to Booking
5. Enter passenger info and confirm — you should see ticket IDs and total price

Note: The database seeds a handful of buses, routes and tomorrow’s schedules on first run.

## 📦 Project Structure Details

### Domain Layer
- Contains core business entities
- No dependencies on other layers
- Pure business logic and domain models

### Application Layer
- Application business logic
- CQRS handlers (MediatR)
- DTOs and mapping profiles (AutoMapper)
- Validation rules (FluentValidation)
- Depends on: Domain, Application.Contracts

### Application.Contracts Layer
- Interface definitions
- DTOs shared between layers
- No implementation code

### Infrastructure Layer
- Data access implementation
- EF Core DbContext and configurations
- External service integrations
- Depends on: Domain, Application

### WebApi Layer
- REST API endpoints
- Dependency injection configuration
- Middleware pipeline
- CORS configuration for Angular
- Depends on: Application, Infrastructure

### ClientApp Layer
- Angular single-page application
- Components, services, and modules
- TailwindCSS for styling
- HTTP communication with backend API

## 🧪 Running Tests

```bash
# Run all tests
dotnet test

# Run tests with coverage
dotnet test /p:CollectCoverage=true
```

## 📝 API Documentation

Once the API is running, you can access:
- Swagger UI: `http://localhost:5000`
- OpenAPI JSON: `http://localhost:5000/swagger/v1/swagger.json`
- Health check: `http://localhost:5000/api/health`

Key endpoints used by the frontend:
- `GET /api/search?from={city}&to={city}&journeyDate=YYYY-MM-DD` — Available buses
- `GET /api/booking/seatplan/{busScheduleId}` — Seat layout and availability
- `POST /api/booking/book` — Confirm booking

## 🔧 Development

### Adding a New Migration

```bash
dotnet tool restore
dotnet tool run dotnet-ef migrations add <MigrationName> \
  --project src/Infrastructure/BusReservationSystem.Infrastructure.csproj \
  --startup-project src/WebApi/BusReservationSystem.WebApi.csproj

dotnet tool run dotnet-ef database update \
  --project src/Infrastructure/BusReservationSystem.Infrastructure.csproj \
  --startup-project src/WebApi/BusReservationSystem.WebApi.csproj
```

Pre-generated idempotent SQL is available in `db/migrations.sql`.

### Frontend API base URL

Update `src/ClientApp/src/environments/environment.ts` if you change backend port or protocol.

### Troubleshooting

- Database connection error (password): ensure PostgreSQL is running and the credentials in `appsettings.json` match your instance. If using Docker, run `docker compose up -d` from repo root.
- HTTPS issues in dev: prefer running API on HTTP with `ASPNETCORE_URLS=http://localhost:5000` as shown above.

### Building the Solution

```bash
dotnet build
```

### Running in Production

```bash
# Backend
cd src/WebApi
dotnet publish -c Release -o ./publish

# Frontend
cd src/ClientApp
npm run build
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Authors

- Your Name

## 🙏 Acknowledgments

- Clean Architecture by Robert C. Martin
- ASP.NET Core Documentation
- Angular Documentation
