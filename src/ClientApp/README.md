# Bus Reservation System - Angular Client

This is the frontend application for the Bus Ticket Reservation System, built with Angular 20 and TailwindCSS.

## Features

- 🔍 **Search Buses**: Search for available buses by origin, destination, and date
- 🪑 **Seat Selection**: Interactive seat plan with real-time availability
- 📝 **Booking Form**: Complete booking with passenger details
- 🎨 **Modern UI**: Built with TailwindCSS for a responsive and beautiful interface
- 🚀 **Standalone Components**: Using Angular's latest standalone component architecture

## Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── search-buses/        # Bus search component
│   │   ├── seat-plan/           # Seat selection component
│   │   └── booking-form/        # Booking form component
│   ├── services/
│   │   ├── bus.service.ts       # Bus API service
│   │   └── booking.service.ts   # Booking API service
│   ├── models/
│   │   ├── bus.model.ts         # Bus-related interfaces
│   │   ├── seat.model.ts        # Seat-related interfaces
│   │   └── booking.model.ts     # Booking-related interfaces
│   ├── shared/
│   │   └── components/          # Shared/reusable components
│   ├── app.config.ts            # Application configuration
│   └── app.routes.ts            # Route definitions
├── environments/
│   ├── environment.ts           # Development environment
│   └── environment.prod.ts      # Production environment
└── styles.css                   # Global styles with TailwindCSS
```

## Routes

- `/search` - Search for available buses (default route)
- `/bus/:id/seatplan` - View and select seats for a specific bus
- `/booking` - Complete booking with passenger information

## Development server

To start a local development server, run:

```bash
ng serve
# or
npm start
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## API Configuration

The API URL is configured in the environment files:

- **Development**: `src/environments/environment.ts`
- **Production**: `src/environments/environment.prod.ts`

Update the `apiUrl` property to point to your backend API:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:5000' // Update this to your API URL
};
```

## Services

### BusService

Handles bus-related API calls:
- `searchBuses(params)` - Search for available buses
- `getBusById(id)` - Get bus details by ID

### BookingService

Handles booking-related API calls:
- `getSeatPlan(busScheduleId)` - Get seat plan for a bus
- `bookSeats(bookingData)` - Book seats
- `getBookingDetails(ticketId)` - Get booking details

## Components

### SearchBusesComponent

Main search interface where users can:
- Enter origin, destination, and departure date
- View available buses
- Navigate to seat selection

### SeatPlanComponent

Interactive seat selection interface:
- Visual seat layout
- Real-time seat availability
- Multiple seat selection
- Booking summary

### BookingFormComponent

Complete booking with passenger details:
- Passenger name, email, and phone
- Form validation
- Booking confirmation display

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Styling

The application uses TailwindCSS for styling. Global styles and custom utilities are defined in `src/styles.css`.

### Custom CSS Classes

- `.btn-primary` - Primary button style
- `.btn-secondary` - Secondary button style
- `.input-field` - Input field style
- `.card` - Card container style

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

