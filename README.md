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
- [PostgreSQL 14+](https://www.postgresql.org/download/)

## 🛠️ Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd Bus-Ticket-Reservation-System
```

### 2. Configure PostgreSQL

Update the connection string in `src/WebApi/appsettings.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Port=5432;Database=BusReservationDb;Username=your_username;Password=your_password"
  }
}
```

### 3. Run Database Migrations

```bash
cd src/Infrastructure
dotnet ef migrations add InitialCreate --startup-project ../WebApi
dotnet ef database update --startup-project ../WebApi
```

### 4. Run the Backend API

```bash
cd src/WebApi
dotnet run
```

The API will be available at:
- HTTPS: `https://localhost:5001`
- HTTP: `http://localhost:5000`

### 5. Run the Frontend

```bash
cd src/ClientApp
npm install
npm start
```

The Angular app will be available at `http://localhost:4200`

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
- OpenAPI specification: `https://localhost:5001/openapi/v1.json`
- Health check: `https://localhost:5001/api/health`

## 🔧 Development

### Adding a New Migration

```bash
cd src/Infrastructure
dotnet ef migrations add <MigrationName> --startup-project ../WebApi
dotnet ef database update --startup-project ../WebApi
```

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
