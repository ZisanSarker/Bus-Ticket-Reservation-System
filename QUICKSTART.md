# Quick Start Guide

## Project Overview

This is a **Clean Architecture** bus reservation system with:
- **.NET 9** backend (5 projects)
- **Angular 20** frontend with TailwindCSS
- **PostgreSQL** database
- **xUnit** test framework

## Project Dependencies

### Backend NuGet Packages

#### Infrastructure
- `Npgsql.EntityFrameworkCore.PostgreSQL` (9.0.4) - PostgreSQL provider
- `Microsoft.EntityFrameworkCore.Design` (9.0.10) - EF Core tools

#### Application  
- `AutoMapper.Extensions.Microsoft.DependencyInjection` (13.0.1) - Object mapping
- `MediatR` (12.4.1) - CQRS pattern
- `FluentValidation.DependencyInjectionExtensions` (12.0.0) - Validation

#### Tests
- `xUnit` - Testing framework (included by template)

### Frontend NPM Packages

#### Core Angular
- `@angular/core` (20.3.0)
- `@angular/router` (20.3.0)
- `@angular/common` (20.3.0)
- `@angular/forms` (20.3.0)

#### Styling
- `tailwindcss` (4.1.16)
- `postcss` (8.5.6)
- `autoprefixer` (10.4.21)

## Key Files

### Backend Configuration
- `src/WebApi/appsettings.json` - Database connection string
- `src/WebApi/Program.cs` - Service configuration and middleware
- `src/Infrastructure/Data/ApplicationDbContext.cs` - EF Core context
- `src/Infrastructure/DependencyInjection.cs` - Infrastructure services
- `src/Application/DependencyInjection.cs` - Application services

### Frontend Configuration
- `src/ClientApp/src/app/app.config.ts` - Angular providers (HttpClient, Router)
- `src/ClientApp/src/environments/environment.ts` - API URL configuration
- `src/ClientApp/tailwind.config.js` - TailwindCSS configuration
- `src/ClientApp/src/styles.css` - Global styles with Tailwind directives

## Default Ports

- **Backend API**: 
  - HTTPS: `https://localhost:5001`
  - HTTP: `http://localhost:5000`
- **Frontend**: `http://localhost:4200`
- **PostgreSQL**: `localhost:5432`

## CORS Configuration

The WebApi is configured to allow requests from `http://localhost:4200` with:
- Any HTTP method
- Any header
- Credentials support

## Database Configuration

Default connection string (update in `appsettings.json`):
```
Host=localhost;Port=5432;Database=BusReservationDb;Username=postgres;Password=postgres
```

## Project References

```
Domain (no dependencies)
  ↑
  ├── Application.Contracts (no dependencies)
  │     ↑
  ├── Application → Domain, Application.Contracts
  │     ↑
  ├── Infrastructure → Domain, Application
  │     ↑
  └── WebApi → Application, Application.Contracts, Infrastructure
```

## Next Steps

1. **Configure PostgreSQL**
   - Install PostgreSQL if not already installed
   - Create a database user
   - Update connection string in `appsettings.json`

2. **Create First Migration**
   ```bash
   cd src/Infrastructure
   dotnet ef migrations add InitialCreate --startup-project ../WebApi
   dotnet ef database update --startup-project ../WebApi
   ```

3. **Run Backend**
   ```bash
   cd src/WebApi
   dotnet run
   ```

4. **Run Frontend**
   ```bash
   cd src/ClientApp
   npm install  # First time only
   npm start
   ```

5. **Test the Setup**
   - Backend health: `https://localhost:5001/api/health`
   - Frontend: `http://localhost:4200`

## Common Commands

### Backend
```bash
# Build solution
dotnet build

# Run tests
dotnet test

# Run WebApi
cd src/WebApi && dotnet run

# Add migration
cd src/Infrastructure
dotnet ef migrations add <Name> --startup-project ../WebApi

# Update database
dotnet ef database update --startup-project ../WebApi
```

### Frontend
```bash
# Install dependencies
npm install

# Start dev server
npm start

# Build for production
npm run build

# Run tests
npm test
```

## Git Status

✅ Repository initialized
✅ Initial commit created
✅ All files committed

Current branch: `main`
Commits: 2
- Initial commit with project structure
- README documentation added
