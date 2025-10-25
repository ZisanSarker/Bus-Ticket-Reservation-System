import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { BookingService } from '../../services/booking.service';
import { SeatPlanDto, SeatDto } from '../../models/seat.model';
import { ToastContainerComponent } from '../shared/toast-container/toast-container.component';

@Component({
  selector: 'app-seat-plan',
  standalone: true,
  imports: [CommonModule, ToastContainerComponent],
  templateUrl: './seat-plan.component.html',
  styleUrl: './seat-plan.component.css'
})
export class SeatPlanComponent implements OnInit {
  seatPlan: SeatPlanDto | null = null;
  selectedSeats: SeatDto[] = [];
  loading = false;
  error: string | null = null;
  busScheduleId!: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bookingService: BookingService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.busScheduleId = params['id'];
      this.loadSeatPlan();
    });
  }

  loadSeatPlan(): void {
    this.loading = true;
    this.error = null;

    this.bookingService.getSeatPlan(this.busScheduleId).subscribe({
      next: (seatPlan) => {
        this.seatPlan = seatPlan;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load seat plan. Please try again.';
        this.loading = false;
        console.error('Error loading seat plan:', err);
      }
    });
  }

  toggleSeat(seat: SeatDto): void {
    if (seat.isBooked) {
      return;
    }

    const index = this.selectedSeats.findIndex(s => s.seatNumber === seat.seatNumber);
    if (index > -1) {
      this.selectedSeats.splice(index, 1);
    } else {
      this.selectedSeats.push(seat);
    }
  }

  isSeatSelected(seat: SeatDto): boolean {
    return this.selectedSeats.some(s => s.seatNumber === seat.seatNumber);
  }

  getTotalPrice(): number {
    if (!this.seatPlan) return 0;
    // Price is not provided by seat plan; backend returns total on booking
    // Keep a placeholder per-seat estimate if needed
    return this.selectedSeats.length * 100; // Placeholder price
  }

  proceedToBooking(): void {
    if (this.selectedSeats.length === 0) {
      return;
    }

    // Navigate to booking form with selected seat IDs
    this.router.navigate(['/booking'], {
      queryParams: {
        busScheduleId: this.busScheduleId,
        seatNumbers: this.selectedSeats.map(s => s.seatNumber).join(',')
      }
    });
  }

  getSeatsByRow(): Map<number, SeatDto[]> {
    if (!this.seatPlan) return new Map();
    
    const seatsByRow = new Map<number, SeatDto[]>();
    this.seatPlan.seats.forEach(seat => {
      const row = seat.row;
      if (!seatsByRow.has(row)) {
        seatsByRow.set(row, []);
      }
      seatsByRow.get(row)!.push(seat);
    });

    // Sort seats within each row by column
    seatsByRow.forEach(seats => {
      seats.sort((a, b) => a.seatNumber - b.seatNumber);
    });

    return seatsByRow;
  }

  // Derive a 2+2 column layout from seat number when column isn't provided
  getColumnIndex(seat: SeatDto): number {
    // Assumes seat numbers increment left-to-right within rows
    return ((seat.seatNumber - 1) % 4) + 1;
  }

  getAvailableCount(): number {
    if (!this.seatPlan) return 0;
    return this.seatPlan.seats.filter(s => !s.isBooked).length;
  }

  goBack(): void {
    this.router.navigate(['/search']);
  }
}
