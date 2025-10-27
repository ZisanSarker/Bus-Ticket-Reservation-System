import { Routes } from '@angular/router';
import { SearchBusesComponent } from './components/search-buses/search-buses.component';
import { SeatPlanComponent } from './components/seat-plan/seat-plan.component';
import { BookingFormComponent } from './components/booking-form/booking-form.component';
import { BookingConfirmationComponent } from './components/booking-confirmation/booking-confirmation.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/search',
    pathMatch: 'full'
  },
  {
    path: 'search',
    component: SearchBusesComponent,
    title: 'Search Buses'
  },
  {
    path: 'bus/:id/confirm',
    component: BookingConfirmationComponent,
    title: 'Confirm Booking'
  },
  // Legacy routes (kept for backward compatibility)
  {
    path: 'bus/:id/seatplan',
    component: SeatPlanComponent,
    title: 'Select Seats'
  },
  {
    path: 'booking',
    component: BookingFormComponent,
    title: 'Complete Booking'
  },
  {
    path: '**',
    redirectTo: '/search'
  }
];
