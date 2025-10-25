# WebApi Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                          Angular Client                              │
│                     (http://localhost:4200)                          │
└──────────────────────────────┬──────────────────────────────────────┘
                               │ HTTP Requests
                               │ (CORS Enabled)
                               ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         WebApi Layer                                 │
│                    (http://localhost:5032)                           │
│                                                                       │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │              Global Exception Handling Middleware               │ │
│  │  • Catches all unhandled exceptions                             │ │
│  │  • Maps to appropriate HTTP status codes                        │ │
│  │  • Returns consistent JSON error format                         │ │
│  └────────────────────────────────────────────────────────────────┘ │
│                               │                                       │
│                               ▼                                       │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │                     Controllers                                 │ │
│  │                                                                  │ │
│  │  ┌──────────────────┐          ┌─────────────────────────┐     │ │
│  │  │ SearchController │          │  BookingController      │     │ │
│  │  │                  │          │                         │     │ │
│  │  │ GET /api/search  │          │ GET /seatplan/{id}      │     │ │
│  │  │                  │          │ POST /book              │     │ │
│  │  └──────────────────┘          └─────────────────────────┘     │ │
│  │           │                                  │                  │ │
│  └───────────┼──────────────────────────────────┼──────────────────┘ │
│              │                                  │                    │
│  ┌───────────┴──────────────────────────────────┴──────────────────┐ │
│  │                  Validation Filter                               │ │
│  │  • ValidateModelStateFilter                                      │ │
│  │  • Automatic model validation on all requests                    │ │
│  └──────────────────────────────────────────────────────────────────┘ │
│                               │                                       │
│                               ▼                                       │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │              Dependency Injection Container                      │ │
│  │                                                                  │ │
│  │  ISearchService   ──→  SearchService                            │ │
│  │  IBookingService  ──→  BookingService                           │ │
│  │  ILogger<T>       ──→  Logger instances                         │ │
│  └────────────────────────────────────────────────────────────────┘ │
└──────────────────────────────┬──────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      Application Layer                               │
│                                                                       │
│  ┌──────────────────┐          ┌─────────────────────────┐          │
│  │  SearchService   │          │   BookingService        │          │
│  │                  │          │                         │          │
│  │ • Search buses   │          │ • Get seat plan         │          │
│  │ • Filter by date │          │ • Book seats            │          │
│  │ • Calculate left │          │ • Transaction handling  │          │
│  └──────────────────┘          └─────────────────────────┘          │
└──────────────────────────────┬──────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    Infrastructure Layer                              │
│                                                                       │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                    Repositories                               │  │
│  │                                                                │  │
│  │  • BusRepository                                              │  │
│  │  • BusScheduleRepository                                      │  │
│  │  • RouteRepository                                            │  │
│  │  • SeatRepository                                             │  │
│  │  • TicketRepository                                           │  │
│  │  • PassengerRepository                                        │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                               │                                      │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                    UnitOfWork                                 │  │
│  │  • Transaction management                                     │  │
│  │  • DbContext coordination                                     │  │
│  └──────────────────────────────────────────────────────────────┘  │
└──────────────────────────────┬──────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      Database Layer                                  │
│                   (PostgreSQL - EF Core)                             │
│                                                                       │
│  Tables: Bus, BusSchedule, Route, Seat, Ticket, Passenger           │
└─────────────────────────────────────────────────────────────────────┘


┌─────────────────────────────────────────────────────────────────────┐
│                       Exception Flow                                 │
│                                                                       │
│  Controller                                                          │
│      │                                                                │
│      │ throws NotFoundException                                      │
│      ▼                                                                │
│  GlobalExceptionHandlingMiddleware                                   │
│      │                                                                │
│      │ catches exception                                             │
│      │ maps to 404 status                                            │
│      │                                                                │
│      ▼                                                                │
│  {                                                                    │
│    "statusCode": 404,                                                │
│    "message": "BusSchedule not found",                               │
│    "details": {...},                                                 │
│    "timestamp": "2025-10-25T10:30:00.000Z"                           │
│  }                                                                    │
└─────────────────────────────────────────────────────────────────────┘


┌─────────────────────────────────────────────────────────────────────┐
│                      Request/Response Flow                           │
│                                                                       │
│  1. Client sends HTTP request                                        │
│     ↓                                                                 │
│  2. CORS middleware validates origin                                 │
│     ↓                                                                 │
│  3. Global exception middleware wraps request                        │
│     ↓                                                                 │
│  4. Routing matches to controller action                             │
│     ↓                                                                 │
│  5. Validation filter checks model state                             │
│     ↓                                                                 │
│  6. Controller action executes                                       │
│     ↓                                                                 │
│  7. Service method is called (DI)                                    │
│     ↓                                                                 │
│  8. Repository queries database                                      │
│     ↓                                                                 │
│  9. Result mapped to DTO                                             │
│     ↓                                                                 │
│ 10. Response serialized to JSON                                      │
│     ↓                                                                 │
│ 11. HTTP response returned to client                                 │
└─────────────────────────────────────────────────────────────────────┘


┌─────────────────────────────────────────────────────────────────────┐
│                    Swagger/OpenAPI Integration                       │
│                                                                       │
│  Developer Access:                                                   │
│  http://localhost:5032  ──→  Swagger UI                             │
│                                                                       │
│  Features:                                                           │
│  • Interactive API documentation                                     │
│  • Try-it-out functionality                                          │
│  • Request/Response schemas                                          │
│  • Example values                                                    │
│  • Authentication support (future)                                   │
└─────────────────────────────────────────────────────────────────────┘
```

## Key Design Patterns

1. **Dependency Injection** - Services injected into controllers
2. **Repository Pattern** - Data access abstraction
3. **Unit of Work Pattern** - Transaction management
4. **Middleware Pattern** - Request pipeline processing
5. **Filter Pattern** - Cross-cutting concerns (validation)
6. **DTO Pattern** - Data transfer objects for API responses

## Error Handling Strategy

```
Exception Type               →  HTTP Status  →  Response Format
─────────────────────────────────────────────────────────────────
NotFoundException            →  404          →  { statusCode, message, details }
SeatAlreadyBookedException  →  409          →  { statusCode, message, details }
ValidationException         →  400          →  { statusCode, message, details }
ArgumentException           →  400          →  { statusCode, message, details }
Other Exceptions            →  500          →  { statusCode, message, details }
```

## CORS Policy

```
Origin:      http://localhost:4200 (Angular)
Methods:     All (GET, POST, PUT, DELETE, PATCH, OPTIONS)
Headers:     All
Credentials: Enabled
```
