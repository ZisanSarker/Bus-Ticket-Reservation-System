import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BookingService } from '../../services/booking.service';
import { SeatPlanDto, SeatDto } from '../../models/seat.model';
import { ToastContainerComponent } from '../shared/toast-container/toast-container.component';

@Component({
  selector: 'app-seat-plan',
  standalone: true,
  imports: [CommonModule, FormsModule, ToastContainerComponent],
  template: `
<div class="min-h-screen bg-gray-100 py-6">
  <app-toast-container />
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <!-- Loading State -->
    @if (loading) {
      <div class="flex justify-center items-center h-96">
        <div class="text-center">
          <div class="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
          <p class="mt-4 text-gray-600 font-medium">Loading seat plan...</p>
        </div>
      </div>
    }

    <!-- Error State -->
    @if (error) {
      <div class="bg-red-50 border-l-4 border-red-500 text-red-700 px-6 py-4 rounded-lg mb-8 shadow-md">
        <div class="flex items-center">
          <svg class="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
          </svg>
          <div>
            <p class="font-semibold">{{ error }}</p>
            <button (click)="goBack()" class="mt-2 underline hover:text-red-800">Go back to search</button>
          </div>
        </div>
      </div>
    }

    <!-- Seat Plan -->
    @if (seatPlan && !loading) {
      <!-- Global Legend Row (full width) -->
      <div class="w-full mb-4">
        <div class="bg-white rounded-lg shadow-md border border-gray-200 px-4 py-3">
          <div class="flex items-center gap-6 overflow-x-auto whitespace-nowrap text-xs sm:text-sm">
            <!-- AVAILABLE -->
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 rounded-lg border-2 border-gray-400 bg-white"></div>
              <span class="font-medium text-gray-700">AVAILABLE</span>
            </div>
            <!-- SELECTED -->
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 rounded-lg border-2 border-green-600 bg-green-500"></div>
              <span class="font-medium text-gray-700">SELECTED</span>
            </div>
            <!-- BOOKED -->
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 rounded-lg border-2 border-purple-600 bg-purple-500"></div>
              <span class="font-medium text-gray-700">BOOKED</span>
            </div>
            <!-- SOLD -->
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 rounded-lg border-2 border-red-300 bg-red-200"></div>
              <span class="font-medium text-gray-700">SOLD</span>
            </div>
            <!-- BLOCKED -->
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 rounded-lg border-2 border-gray-700 bg-gray-600"></div>
              <span class="font-medium text-gray-700">BLOCKED</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Second row: three columns -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Column 1 - Seat Layout -->
        <div>
          <div class="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
            <!-- Removed internal legend; legend moved above to full-width row -->

            <!-- Bus Layout -->
            <div class="p-6 bg-gradient-to-b from-gray-50 to-white">
              <!-- Driver Section -->
              <div class="mb-6 relative">
                <div class="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 bg-gray-200 rounded-full border-2 border-gray-400 flex items-center justify-center">
                  <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/>
                  </svg>
                </div>
                <div class="ml-14 text-sm text-gray-500 italic">Driver's cabin</div>
              </div>

              <!-- Seat Grid -->
              <div class="space-y-2">
                @if (getSeatsByRow().size === 0) {
                  <div class="text-center py-12 text-gray-500">
                    <p class="text-base font-medium">No seats available</p>
                    <p class="text-sm mt-1">Please try another bus</p>
                  </div>
                } @else {
                  @for (row of getSeatsByRow() | keyvalue; track row.key) {
                    <div class="flex justify-between items-center gap-4 px-2">
                      <!-- Left side seats (first 2 seats) -->
                      <div class="flex gap-2">
                        @for (seat of getSeatsInRange(row.value, 0, 2); track seat.seatId) {
                          <button
                            (click)="toggleSeat(seat)"
                            [disabled]="seat.isBooked || seat.isSold || seat.isBlocked"
                            [ngClass]="getSeatClass(seat)"
                            [title]="getSeatTitle(seat)"
                            class="relative w-12 h-12 sm:w-14 sm:h-14 rounded-lg border-2 font-bold text-sm transition-all duration-200 
                                   flex items-center justify-center hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-1"
                          >
                            <span>{{ seat.seatNumber }}</span>
                          </button>
                        }
                      </div>
                      
                      <!-- Aisle -->
                      <div class="flex-1 min-w-[20px]"></div>
                      
                      <!-- Right side seats (last 2 seats) -->
                      <div class="flex gap-2">
                        @for (seat of getSeatsInRange(row.value, 2, 4); track seat.seatId) {
                          <button
                            (click)="toggleSeat(seat)"
                            [disabled]="seat.isBooked || seat.isSold || seat.isBlocked"
                            [ngClass]="getSeatClass(seat)"
                            [title]="getSeatTitle(seat)"
                            class="relative w-12 h-12 sm:w-14 sm:h-14 rounded-lg border-2 font-bold text-sm transition-all duration-200 
                                   flex items-center justify-center hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-1"
                          >
                            <span>{{ seat.seatNumber }}</span>
                          </button>
                        }
                      </div>
                    </div>
                  }
                }
              </div>
            </div>
          </div>
        </div>

        <!-- Column 2 - Boarding/Dropping & Price -->
        <div>
          <div class="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <!-- Boarding/Dropping Points -->
            <div class="mb-6">
              <div class="bg-red-500 text-white px-4 py-2 rounded-t-md font-semibold text-center">
                BOARDING/DROPPING:
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border border-t-0 border-gray-300 rounded-b-md">
                <!-- Boarding Point -->
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">
                    BOARDING POINT*
                  </label>
                  <select 
                    [(ngModel)]="selectedBoardingPoint"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm"
                  >
                    <option value="" disabled [selected]="!(seatPlan.boardingPoints.length > 0)">Select boarding point</option>
                    @for (point of seatPlan.boardingPoints; track point.stopId) {
                      <option [value]="point.stopId">
                        [{{ point.time }}] {{ point.stopName }}
                      </option>
                    }
                  </select>
                  @if (!(seatPlan.boardingPoints.length > 0)) {
                    <p class="mt-2 text-xs text-gray-500">No boarding points provided for this schedule.</p>
                  }
                </div>

                <!-- Dropping Point -->
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">
                    DROPPING POINT*
                  </label>
                  <select
                    [(ngModel)]="selectedDroppingPoint"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm"
                  >
                    <option value="">Select dropping point</option>
                    @for (point of seatPlan.droppingPoints; track point.stopId) {
                      <option [value]="point.stopId">
                        [{{ point.time }}] {{ point.stopName }}
                      </option>
                    }
                  </select>
                </div>
              </div>

              <!-- Price Breakdown -->
              <div class="mt-4 p-4 bg-gray-50 rounded-md border border-gray-200">
                <div class="grid grid-cols-2 gap-2 text-sm">
                  <div class="flex justify-between">
                    <span class="text-gray-600">Seat Price:</span>
                    <span class="font-semibold text-green-600">₹ {{ seatPlan.baseFare * selectedSeats.length }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">Service Charge:</span>
                    <span class="font-semibold text-green-600">₹ {{ seatPlan.serviceCharge * selectedSeats.length }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">PGW Charge:</span>
                    <span class="font-semibold text-gray-600">₹ 28 (₹ 28)</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600 font-bold">Total Discount:</span>
                    <span class="font-semibold text-green-600">₹ 48</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Column 3 - Mobile Number, Submit & Summary -->
        <div>
          <div class="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <!-- Mobile Number -->
            <div class="mb-6">
              <label class="block text-sm font-semibold text-gray-700 mb-2">
                MOBILE NUMBER*
              </label>
              <input
                type="tel"
                [(ngModel)]="mobileNumber"
                placeholder="Enter your mobile number"
                class="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <!-- Submit Button -->
            <button
              (click)="proceedToBooking()"
              [disabled]="!canProceed()"
              class="w-full bg-red-600 text-white px-6 py-4 rounded-md font-bold text-lg hover:bg-red-700 transition duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed shadow-md"
            >
              SUBMIT
            </button>

            <!-- Terms & Conditions -->
            <div class="mt-4 text-xs text-gray-600 bg-blue-50 p-3 rounded-md border border-blue-200">
              <p class="mb-1">I have already verified my phone number, and have a password.</p>
              <p class="mb-1">Login with password <a href="#" class="text-blue-600 underline">Click here</a></p>
              <p class="mt-2">
                By logging in you are agreeing to the
                <a href="#" class="text-blue-600 underline">Terms & Conditions</a> and
                <a href="#" class="text-blue-600 underline">Privacy Notice</a> of bdtickets
              </p>
            </div>

            <!-- Selected Seats Summary -->
            @if (selectedSeats.length > 0) {
              <div class="mt-6 p-4 bg-green-50 rounded-md border border-green-200">
                <h3 class="font-semibold text-gray-800 mb-2">Selected Seats ({{ selectedSeats.length }})</h3>
                <div class="flex flex-wrap gap-2">
                  @for (seat of selectedSeats; track seat.seatId) {
                    <span class="px-3 py-1 bg-green-500 text-white rounded-full text-sm font-bold">
                      {{ seat.seatNumber }}
                    </span>
                  }
                </div>
                <div class="mt-3 pt-3 border-t border-green-300">
                  <div class="flex justify-between items-center">
                    <span class="font-bold text-gray-800">Total Amount:</span>
                    <span class="font-bold text-xl text-green-600">₹ {{ getTotalPrice() }}</span>
                  </div>
                </div>
              </div>
            }
          </div>
        </div>
      </div>
    }
  </div>
</div>
  `,
  styles: [`
/* Component-specific styles */

/* Seat button base styles */
button[disabled] {
  pointer-events: none;
}

/* Enhanced seat hover effects for available seats */
button:not([disabled]):hover {
  transform: scale(1.05);
  z-index: 10;
}

/* Smooth transitions */
button {
  transition: all 0.2s ease-in-out;
}

/* Active/Click effect */
button:not([disabled]):active {
  transform: scale(0.98);
}

/* Scrollbar styling for selected seats container */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 10px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #3b82f6;
  border-radius: 10px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #2563eb;
}

/* Loading spinner animation */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

/* Select dropdown styling */
select {
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236B7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E");
  background-position: right 0.5rem center;
  background-repeat: no-repeat;
  background-size: 1.5em 1.5em;
  padding-right: 2.5rem;
}

/* Input focus styles */
input:focus,
select:focus {
  outline: none;
}

/* Responsive adjustments for mobile */
@media (max-width: 640px) {
  button {
    min-width: 2.5rem !important;
    min-height: 2.5rem !important;
    font-size: 0.75rem !important;
  }
}
  `]
})
export class SeatPlanComponent implements OnInit {
  seatPlan: SeatPlanDto | null = null;
  selectedSeats: SeatDto[] = [];
  loading = false;
  error: string | null = null;
  busScheduleId!: string;
  
  // Form fields
  selectedBoardingPoint: string = '';
  selectedDroppingPoint: string = '';
  mobileNumber: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bookingService: BookingService,
    private cdr: ChangeDetectorRef
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

    console.log('Loading seat plan for schedule ID:', this.busScheduleId);

    this.bookingService.getSeatPlan(this.busScheduleId).subscribe({
      next: (seatPlan) => {
        console.log('Seat plan loaded successfully:', seatPlan);
        console.log('Total seats:', seatPlan.totalSeats);
        console.log('Seats array length:', seatPlan.seats?.length);
        console.log('Seats data:', seatPlan.seats);
        
        this.seatPlan = seatPlan;
        // Preselect boarding/dropping if provided by backend
        if (seatPlan.boardingPoints && seatPlan.boardingPoints.length > 0) {
          this.selectedBoardingPoint = seatPlan.boardingPoints[0].stopId;
        }
        if (seatPlan.droppingPoints && seatPlan.droppingPoints.length > 0) {
          this.selectedDroppingPoint = seatPlan.droppingPoints[0].stopId;
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading seat plan:', err);
        this.error = 'Failed to load seat plan. Please try again.';
        this.loading = false;
      }
    });
  }

  toggleSeat(seat: SeatDto): void {
    if (seat.isBooked || seat.isSold || seat.isBlocked) {
      console.log('Seat is not available:', seat);
      return;
    }

    const index = this.selectedSeats.findIndex(s => s.seatId === seat.seatId);
    if (index > -1) {
      this.selectedSeats.splice(index, 1);
      console.log('Deselected seat:', seat.seatNumber, 'Selected seats:', this.selectedSeats.map(s => s.seatNumber));
    } else {
      this.selectedSeats.push(seat);
      console.log('Selected seat:', seat.seatNumber, 'Selected seats:', this.selectedSeats.map(s => s.seatNumber));
    }
    
    // Force change detection
    this.cdr.detectChanges();
    console.log('Change detection triggered. Is seat selected?', this.isSeatSelected(seat));
  }

  isSeatSelected(seat: SeatDto): boolean {
      return this.selectedSeats.some(s => s.seatId === seat.seatId);
  }

  getTotalPrice(): number {
    if (!this.seatPlan) return 0;
    return this.selectedSeats.length * this.seatPlan.baseFare;
  }

  getSeatClass(seat: SeatDto): string {
    const isSelected = this.isSeatSelected(seat);
    
    if (isSelected) {
      // Selected seat - bright green
      return 'bg-green-500 border-green-600 text-white shadow-lg focus:ring-green-500';
    } else if (seat.isBlocked) {
      // Blocked seat - dark gray
      return 'bg-gray-600 border-gray-700 text-gray-300 cursor-not-allowed opacity-70';
    } else if (seat.isSold) {
      // Sold seat - light pink/red
      return 'bg-red-200 border-red-300 text-red-700 cursor-not-allowed opacity-70';
    } else if (seat.isBooked) {
      // Booked seat - purple
      return 'bg-purple-500 border-purple-600 text-white cursor-not-allowed opacity-70';
    } else {
      // Available seat - white/gray
      return 'bg-white border-gray-400 text-gray-700 hover:border-green-500 hover:bg-green-50 cursor-pointer focus:ring-green-500';
    }
  }

  getSeatTitle(seat: SeatDto): string {
    if (this.isSeatSelected(seat)) {
      return `Seat ${seat.seatNumber} - Selected (Click to deselect)`;
    } else if (seat.isBlocked) {
      return `Seat ${seat.seatNumber} - Blocked (Not available)`;
    } else if (seat.isSold) {
      return `Seat ${seat.seatNumber} - Sold (Not available)`;
    } else if (seat.isBooked) {
      return `Seat ${seat.seatNumber} - Booked (Not available)`;
    } else {
      return `Seat ${seat.seatNumber} - Available (Click to select)`;
    }
  }

  clearSelection(): void {
    this.selectedSeats = [];
  }

  getSeatsInRange(seats: SeatDto[], start: number, end: number): SeatDto[] {
    return seats.slice(start, end);
  }

  canProceed(): boolean {
    return this.selectedSeats.length > 0 && 
           this.selectedBoardingPoint !== '' && 
           this.selectedDroppingPoint !== '' && 
           this.mobileNumber !== '';
  }

  proceedToBooking(): void {
    if (this.selectedSeats.length === 0) {
      return;
    }

    this.router.navigate(['/booking'], {
      queryParams: {
        busScheduleId: this.busScheduleId,
        seatNumbers: this.selectedSeats.map(s => s.seatNumber).join(',')
      }
    });
  }

  getSeatsByRow(): Map<number, SeatDto[]> {
    if (!this.seatPlan) {
      console.log('No seat plan available');
      return new Map();
    }
    
    console.log('Organizing seats by row. Total seats:', this.seatPlan.seats.length);
    
    const seatsByRow = new Map<number, SeatDto[]>();
    this.seatPlan.seats.forEach(seat => {
      const row = seat.row;
      if (!seatsByRow.has(row)) {
        seatsByRow.set(row, []);
      }
      seatsByRow.get(row)!.push(seat);
    });

    // Sort seats in each row by seat number
    seatsByRow.forEach(seats => {
      seats.sort((a, b) => a.seatNumber - b.seatNumber);
    });

    console.log('Seats organized into rows:', seatsByRow.size, 'rows');
    seatsByRow.forEach((seats, row) => {
      console.log(`Row ${row}:`, seats.map(s => s.seatNumber).join(', '));
    });

    return seatsByRow;
  }

  getColumnIndex(seat: SeatDto): number {
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
