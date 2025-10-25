import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BookingService } from '../../services/booking.service';
import { BookSeatInputDto, BookSeatResultDto } from '../../models/booking.model';

@Component({
  selector: 'app-booking-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './booking-form.component.html',
  styleUrl: './booking-form.component.css'
})
export class BookingFormComponent implements OnInit {
  bookingForm!: FormGroup;
  busScheduleId!: number;
  seatIds: number[] = [];
  loading = false;
  error: string | null = null;
  bookingResult: BookSeatResultDto | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private bookingService: BookingService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.busScheduleId = +params['busScheduleId'];
      this.seatIds = params['seatIds'] ? params['seatIds'].split(',').map((id: string) => +id) : [];

      if (!this.busScheduleId || this.seatIds.length === 0) {
        this.error = 'Invalid booking parameters. Please select seats first.';
        return;
      }

      this.initializeForm();
    });
  }

  initializeForm(): void {
    this.bookingForm = this.fb.group({
      passengerName: ['', [Validators.required, Validators.minLength(2)]],
      passengerEmail: ['', [Validators.required, Validators.email]],
      passengerPhone: ['', [Validators.required, Validators.pattern(/^\+?[\d\s-()]+$/)]]
    });
  }

  onSubmit(): void {
    if (this.bookingForm.valid) {
      this.loading = true;
      this.error = null;

      const bookingData: BookSeatInputDto = {
        busScheduleId: this.busScheduleId,
        seatIds: this.seatIds,
        passengerName: this.bookingForm.value.passengerName,
        passengerEmail: this.bookingForm.value.passengerEmail,
        passengerPhone: this.bookingForm.value.passengerPhone
      };

      this.bookingService.bookSeats(bookingData).subscribe({
        next: (result) => {
          this.bookingResult = result;
          this.loading = false;
        },
        error: (err) => {
          this.error = err.error?.message || 'Failed to book seats. Please try again.';
          this.loading = false;
          console.error('Error booking seats:', err);
        }
      });
    } else {
      Object.keys(this.bookingForm.controls).forEach(key => {
        this.bookingForm.get(key)?.markAsTouched();
      });
    }
  }

  goToSearch(): void {
    this.router.navigate(['/search']);
  }

  goBack(): void {
    this.router.navigate(['/bus', this.busScheduleId, 'seatplan']);
  }

  printTicket(): void {
    window.print();
  }
}
