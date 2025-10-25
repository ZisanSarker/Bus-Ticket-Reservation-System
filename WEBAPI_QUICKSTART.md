# WebApi Quick Reference Card

## 🚀 Quick Start

```bash
# Run the application
dotnet run --project src/WebApi

# Access Swagger UI
http://localhost:5032
```

## 📡 API Endpoints

### Search Buses
```http
GET /api/search?from=Dhaka&to=Chittagong&journeyDate=2025-10-30
```

### Get Seat Plan
```http
GET /api/booking/seatplan/{busScheduleId}
```

### Book Seats
```http
POST /api/booking/book
Content-Type: application/json

{
  "busScheduleId": "guid",
  "passengerName": "John Doe",
  "passengerPhone": "+8801712345678",
  "seatNumbers": [1, 2, 3]
}
```

## 🔧 Architecture Components

### Controllers
- ✅ `SearchController` - Bus search operations
- ✅ `BookingController` - Seat plan and booking operations

### Middleware
- ✅ `GlobalExceptionHandlingMiddleware` - Centralized error handling

### Filters
- ✅ `ValidateModelStateFilter` - Automatic model validation

### Services (Injected)
- ✅ `ISearchService` → `SearchService`
- ✅ `IBookingService` → `BookingService`

## 📊 HTTP Status Codes

| Code | Meaning | When |
|------|---------|------|
| 200 | Success | Operation completed successfully |
| 400 | Bad Request | Validation errors, missing params |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Seat already booked |
| 500 | Server Error | Unexpected error |

## 🔒 CORS Configuration

- **Allowed Origin**: `http://localhost:4200`
- **Methods**: All (GET, POST, PUT, DELETE, etc.)
- **Headers**: All
- **Credentials**: Enabled

## 🧪 Testing Options

1. **Swagger UI** - `http://localhost:5032`
2. **HTTP File** - `BusReservationSystem.WebApi.http`
3. **cURL** - Command line
4. **Postman** - Import Swagger JSON

## 📝 Error Response Example

```json
{
  "statusCode": 404,
  "message": "BusSchedule 'guid' not found",
  "details": {
    "resource": "BusSchedule",
    "key": "guid"
  },
  "timestamp": "2025-10-25T10:30:00.000Z"
}
```

## 💡 Key Features

- ✅ Dependency Injection
- ✅ Global Exception Handling
- ✅ Automatic Validation
- ✅ CORS Support
- ✅ Swagger Documentation
- ✅ Structured Logging
- ✅ Async/Await
- ✅ RESTful Design

## 🗂️ Project Structure

```
WebApi/
├── Controllers/
│   ├── SearchController.cs
│   └── BookingController.cs
├── Middleware/
│   ├── GlobalExceptionHandlingMiddleware.cs
│   └── MiddlewareExtensions.cs
├── Filters/
│   └── ValidateModelStateFilter.cs
└── Program.cs
```

## 🔍 Useful Commands

```bash
# Build
dotnet build src/WebApi

# Run
dotnet run --project src/WebApi

# Watch mode (auto-reload)
dotnet watch --project src/WebApi

# Restore packages
dotnet restore

# Clean build artifacts
dotnet clean
```

## 📚 Documentation

- Full Documentation: `src/WebApi/README.md`
- Implementation Summary: `WEBAPI_IMPLEMENTATION.md`
- Test Requests: `src/WebApi/BusReservationSystem.WebApi.http`
