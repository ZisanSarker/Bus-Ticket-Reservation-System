import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { BookingService } from '../../services/booking.service';
import { SeatPlanDto, SeatDto } from '../../models/seat.model';

@Component({
  selector: 'app-seat-plan',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './seat-plan.component.html',
  styleUrl: './seat-plan.component.css'
})
export class SeatPlanComponent implements OnInit {
  seatPlan: SeatPlanDto | null = null;
  selectedSeats: SeatDto[] = [];
  loading = false;
  error: string | null = null;
  busScheduleId!: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bookingService: BookingService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.busScheduleId = +params['id'];
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
    if (!seat.isAvailable) {
      return;
    }

    const index = this.selectedSeats.findIndex(s => s.id === seat.id);
    if (index > -1) {
      this.selectedSeats.splice(index, 1);
    } else {
      this.selectedSeats.push(seat);
    }
  }

  isSeatSelected(seat: SeatDto): boolean {
    return this.selectedSeats.some(s => s.id === seat.id);
  }

  getTotalPrice(): number {
    if (!this.seatPlan) return 0;
    // Assuming price per seat is same for all seats
    // In real scenario, you might get this from the bus details
    return this.selectedSeats.length * 100; // Default price
  }

  proceedToBooking(): void {
    if (this.selectedSeats.length === 0) {
      return;
    }

    // Navigate to booking form with selected seat IDs
    this.router.navigate(['/booking'], {
      queryParams: {
        busScheduleId: this.busScheduleId,
        seatIds: this.selectedSeats.map(s => s.id).join(',')
      }
    });
  }

  getSeatsByRow(): Map<number, SeatDto[]> {
    if (!this.seatPlan) return new Map();
    
    const seatsByRow = new Map<number, SeatDto[]>();
    this.seatPlan.seats.forEach(seat => {
      const row = seat.position.row;
      if (!seatsByRow.has(row)) {
        seatsByRow.set(row, []);
      }
      seatsByRow.get(row)!.push(seat);
    });

    // Sort seats within each row by column
    seatsByRow.forEach(seats => {
      seats.sort((a, b) => a.position.column - b.position.column);
    });

    return seatsByRow;
  }

  goBack(): void {
    this.router.navigate(['/search']);
  }
}
