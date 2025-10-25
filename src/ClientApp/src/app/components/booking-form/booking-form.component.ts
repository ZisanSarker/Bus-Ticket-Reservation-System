import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BookingService } from '../../services/booking.service';
import { BookSeatInputDto, BookSeatResultDto } from '../../models/booking.model';
import { ToastService } from '../../services/toast.service';
import { ToastContainerComponent } from '../shared/toast-container/toast-container.component';

@Component({
  selector: 'app-booking-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ToastContainerComponent],
  templateUrl: './booking-form.component.html',
  styleUrl: './booking-form.component.css'
})
export class BookingFormComponent implements OnInit {
  bookingForm!: FormGroup;
  busScheduleId!: string;
  seatNumbers: number[] = [];
  loading = false;
  error: string | null = null;
  bookingResult: BookSeatResultDto | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private bookingService: BookingService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.busScheduleId = params['busScheduleId'];
      this.seatNumbers = params['seatNumbers'] ? params['seatNumbers'].split(',').map((n: string) => +n) : [];

      if (!this.busScheduleId || this.seatNumbers.length === 0) {
        this.error = 'Invalid booking parameters. Please select seats first.';
        return;
      }

      this.initializeForm();
    });
  }

  initializeForm(): void {
    this.bookingForm = this.fb.group({
      passengerName: ['', [Validators.required, Validators.minLength(2)]],
      passengerPhone: ['', [Validators.required, Validators.pattern(/^\+?[\d\s-()]+$/)]]
    });
  }

  onSubmit(): void {
    if (this.bookingForm.valid) {
      this.loading = true;
      this.error = null;

      const bookingData: BookSeatInputDto = {
        busScheduleId: this.busScheduleId,
        seatNumbers: this.seatNumbers,
        passengerName: this.bookingForm.value.passengerName,
        passengerPhone: this.bookingForm.value.passengerPhone
      };

      this.bookingService.bookSeats(bookingData).subscribe({
        next: (result) => {
          this.bookingResult = result;
          this.loading = false;
          this.toast.success('Booking confirmed');
          // Navigate back to seat plan and let it refresh
          this.router.navigate(['/bus', this.busScheduleId, 'seatplan']);
        },
        error: (err) => {
          this.error = err.error?.message || 'Failed to book seats. Please try again.';
          this.toast.error(this.error);
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
