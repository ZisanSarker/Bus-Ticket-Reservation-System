# WebApi Implementation Guide

## Overview

This document describes the implementation of the Bus Reservation System WebApi project, including controllers, dependency injection, global exception handling, validation filters, and CORS configuration.

## Architecture

### Controllers

#### 1. SearchController (`/api/search`)
Handles bus search operations.

**Endpoints:**
- `GET /api/search` - Search for available buses

**Query Parameters:**
- `from` (required): Departure city
- `to` (required): Destination city
- `journeyDate` (required): Journey date (DateTime)

**Response:**
- `200 OK`: Returns `List<AvailableBusDto>`
- `400 Bad Request`: Invalid parameters or past date

**Example:**
```http
GET /api/search?from=Dhaka&to=Chittagong&journeyDate=2025-10-30
```

#### 2. BookingController (`/api/booking`)
Handles seat plan retrieval and booking operations.

**Endpoints:**

##### Get Seat Plan
- `GET /api/booking/seatplan/{busScheduleId}`

**Response:**
- `200 OK`: Returns `SeatPlanDto` with all seats and their booking status
- `404 Not Found`: Schedule not found

**Example:**
```http
GET /api/booking/seatplan/550e8400-e29b-41d4-a716-446655440000
```

##### Book Seats
- `POST /api/booking/book`

**Request Body:**
```json
{
  "busScheduleId": "550e8400-e29b-41d4-a716-446655440000",
  "passengerName": "John Doe",
  "passengerPhone": "+8801712345678",
  "seatNumbers": [1, 2, 3]
}
```

**Response:**
- `200 OK`: Returns `BookSeatResultDto` with ticket IDs and total price
- `400 Bad Request`: Validation errors
- `404 Not Found`: Schedule or seats not found
- `409 Conflict`: Seats already booked

## Dependency Injection

Services are automatically registered through the application layers:

### Application Layer (`AddApplication()`)
- Registers `ISearchService` → `SearchService`
- Registers `IBookingService` → `BookingService`

### Infrastructure Layer (`AddInfrastructure()`)
- Registers repositories
- Registers `DbContext`
- Registers `IUnitOfWork`

### WebApi Layer
- Registers controllers with validation filters
- Configures Swagger/OpenAPI
- Configures CORS
- Adds global exception handling

## Global Exception Handling

### GlobalExceptionHandlingMiddleware

Provides centralized exception handling with appropriate HTTP status codes:

| Exception Type | HTTP Status | Description |
|---------------|-------------|-------------|
| `NotFoundException` | 404 | Resource not found |
| `SeatAlreadyBookedException` | 409 | Seat booking conflict |
| `ValidationException` | 400 | Business validation failed |
| `ArgumentException` | 400 | Invalid arguments |
| Other exceptions | 500 | Internal server error |

**Error Response Format:**
```json
{
  "statusCode": 404,
  "message": "BusSchedule '550e8400-e29b-41d4-a716-446655440000' not found",
  "details": {
    "resource": "BusSchedule",
    "key": "550e8400-e29b-41d4-a716-446655440000"
  },
  "timestamp": "2025-10-25T10:30:00.000Z"
}
```

## Validation

### ValidateModelStateFilter

Automatically validates model state for all controller actions.

**Validation Error Response:**
```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "errors": {
    "passengerName": ["The passengerName field is required."],
    "seatNumbers": ["At least one seat must be selected."]
  },
  "timestamp": "2025-10-25T10:30:00.000Z"
}
```

## CORS Configuration

CORS is configured to allow requests from the Angular client:

```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngularApp",
        policy => policy
            .WithOrigins("http://localhost:4200")
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials());
});
```

**Allowed:**
- Origin: `http://localhost:4200`
- Methods: All (GET, POST, PUT, DELETE, etc.)
- Headers: All
- Credentials: Yes

## Swagger/OpenAPI Documentation

Swagger is configured for API documentation and testing:

- **Development URL**: `http://localhost:5032` (Swagger UI at root)
- **Swagger JSON**: `http://localhost:5032/swagger/v1/swagger.json`

### Features:
- Interactive API testing
- Request/response schemas
- XML documentation comments
- Example values

## Testing the API

### Using Swagger UI

1. Run the application:
   ```bash
   dotnet run --project src/WebApi
   ```

2. Navigate to: `http://localhost:5032`

3. Swagger UI will display all available endpoints with:
   - Parameter descriptions
   - Request/response models
   - Try-it-out functionality

### Using HTTP Files

The `BusReservationSystem.WebApi.http` file contains pre-configured requests for testing all endpoints.

**Visual Studio Code:**
- Install the "REST Client" extension
- Click "Send Request" above each request

**Visual Studio:**
- Open the `.http` file
- Click the "Send Request" button

### Using cURL

**Search Buses:**
```bash
curl -X GET "http://localhost:5032/api/search?from=Dhaka&to=Chittagong&journeyDate=2025-10-30" \
  -H "Accept: application/json"
```

**Get Seat Plan:**
```bash
curl -X GET "http://localhost:5032/api/booking/seatplan/550e8400-e29b-41d4-a716-446655440000" \
  -H "Accept: application/json"
```

**Book Seats:**
```bash
curl -X POST "http://localhost:5032/api/booking/book" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "busScheduleId": "550e8400-e29b-41d4-a716-446655440000",
    "passengerName": "John Doe",
    "passengerPhone": "+8801712345678",
    "seatNumbers": [1, 2]
  }'
```

## Error Scenarios

### Common Error Responses

1. **Missing Required Parameter (400)**
   ```json
   {
     "statusCode": 400,
     "message": "From parameter is required",
     "details": null,
     "timestamp": "2025-10-25T10:30:00.000Z"
   }
   ```

2. **Schedule Not Found (404)**
   ```json
   {
     "statusCode": 404,
     "message": "BusSchedule '99999999-9999-9999-9999-999999999999' not found",
     "details": {
       "resource": "BusSchedule",
       "key": "99999999-9999-9999-9999-999999999999"
     },
     "timestamp": "2025-10-25T10:30:00.000Z"
   }
   ```

3. **Seat Already Booked (409)**
   ```json
   {
     "statusCode": 409,
     "message": "One or more seats are already booked for schedule 550e8400-e29b-41d4-a716-446655440000: 1, 2",
     "details": {
       "busScheduleId": "550e8400-e29b-41d4-a716-446655440000",
       "bookedSeats": [1, 2]
     },
     "timestamp": "2025-10-25T10:30:00.000Z"
   }
   ```

## Production Considerations

### Security
- [ ] Add authentication/authorization (JWT)
- [ ] Rate limiting
- [ ] API key validation
- [ ] HTTPS enforcement

### Performance
- [ ] Response caching
- [ ] Database query optimization
- [ ] Connection pooling
- [ ] Async operations (already implemented)

### Monitoring
- [ ] Application Insights or similar
- [ ] Health checks
- [ ] Structured logging
- [ ] Performance metrics

### CORS
- Update allowed origins for production
- Consider environment-based configuration

## Configuration

### appsettings.json
```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "AllowedHosts": "*",
  "ConnectionStrings": {
    "DefaultConnection": "..."
  },
  "CorsOrigins": [
    "http://localhost:4200"
  ]
}
```

### Environment Variables
- `ASPNETCORE_ENVIRONMENT`: Development/Staging/Production
- `ASPNETCORE_URLS`: http://localhost:5032

## Next Steps

1. ✅ Implement controllers
2. ✅ Add dependency injection
3. ✅ Global exception handling
4. ✅ Validation filters
5. ✅ CORS configuration
6. ✅ Swagger documentation
7. ⬜ Add authentication/authorization
8. ⬜ Implement rate limiting
9. ⬜ Add comprehensive unit tests
10. ⬜ Integration tests
