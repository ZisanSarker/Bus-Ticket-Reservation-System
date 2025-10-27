import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BookingService } from '../../services/booking.service';
import { SeatPlanDto, SeatDto, RouteStopDto } from '../../models/seat.model';
import { BookSeatInputDto, BookSeatResultDto } from '../../models/booking.model';
import { ToastService } from '../../services/toast.service';
import { ToastContainerComponent } from '../shared/toast-container/toast-container.component';

@Component({
  selector: 'app-booking-confirmation',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ToastContainerComponent],
  template: `
<div class="min-h-screen bg-gray-50">
  <app-toast-container />
  
  <!-- Success State -->
  @if (bookingResult) {
    <div class="max-w-4xl mx-auto px-4 py-8">
      <!-- Screen-only success message -->
      <div class="no-print bg-white rounded-lg shadow-md p-8 mb-6">
        <div class="text-center mb-6">
          <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
            <svg class="h-10 w-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
            </svg>
          </div>
          <h1 class="text-3xl font-bold text-gray-900 mb-2">Booking Confirmed!</h1>
          <p class="text-gray-600">Your ticket has been successfully booked</p>
        </div>

        <div class="flex flex-col sm:flex-row gap-4">
          <button
            (click)="printTicket()"
            class="flex-1 bg-gray-600 text-white px-6 py-3 rounded-md font-semibold hover:bg-gray-700 transition duration-200 flex items-center justify-center gap-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/>
            </svg>
            Print Ticket
          </button>
          <button
            (click)="goToSearch()"
            class="flex-1 bg-blue-600 text-white px-6 py-3 rounded-md font-semibold hover:bg-blue-700 transition duration-200"
          >
            Book Another Ticket
          </button>
        </div>
      </div>

      <!-- Professional Ticket Design (Two-Column Layout for One Page) -->
      <div id="ticket-container" class="bg-white rounded-lg shadow-xl overflow-hidden border-2 border-gray-300">
        <!-- Ticket Header -->
        <div class="bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-4">
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-2xl font-bold mb-1">BUS TICKET</h2>
              <p class="text-red-100 text-xs">Bus Reservation System</p>
            </div>
            <div class="text-right">
              <div class="bg-white text-red-600 px-3 py-2 rounded">
                <p class="text-xs font-semibold">TICKET NO.</p>
                <p class="text-base font-bold">{{ bookingResult.ticketIds[0] }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Two-Column Ticket Body -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-0 border-b-2 border-gray-300">
          <!-- Left Column -->
          <div class="p-6 border-r-2 border-gray-300">
            <!-- Journey Details -->
            <div class="mb-6">
              <h3 class="text-sm font-bold text-white bg-red-600 px-3 py-2 mb-3">JOURNEY DETAILS</h3>
              
              <div class="space-y-4">
                <!-- From -->
                <div class="border-l-4 border-red-600 pl-3">
                  <p class="text-xs font-semibold text-gray-500 uppercase">From</p>
                  <p class="text-base font-bold text-gray-900">{{ getSelectedBoardingPoint()?.stopName || 'N/A' }}</p>
                  <p class="text-sm text-gray-600">{{ getSelectedBoardingPoint()?.time || '' }}</p>
                </div>

                <!-- To -->
                <div class="border-l-4 border-red-600 pl-3">
                  <p class="text-xs font-semibold text-gray-500 uppercase">To</p>
                  <p class="text-base font-bold text-gray-900">{{ getSelectedDroppingPoint()?.stopName || 'N/A' }}</p>
                  <p class="text-sm text-gray-600">{{ getSelectedDroppingPoint()?.time || '' }}</p>
                </div>

                <!-- Journey Date -->
                <div class="border-l-4 border-red-600 pl-3">
                  <p class="text-xs font-semibold text-gray-500 uppercase">Journey Date</p>
                  <p class="text-base font-bold text-gray-900">{{ getCurrentDate() }}</p>
                </div>
              </div>
            </div>

            <!-- Passenger Information -->
            <div class="mb-6">
              <h3 class="text-sm font-bold text-white bg-red-600 px-3 py-2 mb-3">PASSENGER INFORMATION</h3>
              
              <div class="space-y-3">
                <div>
                  <p class="text-xs font-semibold text-gray-500 uppercase">Passenger Name</p>
                  <p class="text-base font-semibold text-gray-900">{{ getPassengerName() }}</p>
                </div>
                <div>
                  <p class="text-xs font-semibold text-gray-500 uppercase">Mobile Number</p>
                  <p class="text-base font-semibold text-gray-900">{{ getMobileNumber() }}</p>
                </div>
                <div>
                  <p class="text-xs font-semibold text-gray-500 uppercase mb-2">Seat Number(s)</p>
                  <div class="flex flex-wrap gap-2">
                    @for (seat of bookingResult.seatNumbers; track seat) {
                      <span class="inline-flex items-center justify-center bg-red-600 text-white font-bold text-base px-3 py-1 rounded min-w-[50px]">
                        {{ seat }}
                      </span>
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Column -->
          <div class="p-6">
            <!-- Fare Details -->
            <div class="mb-6">
              <h3 class="text-sm font-bold text-white bg-red-600 px-3 py-2 mb-3">FARE DETAILS</h3>
              
              <div class="bg-gray-50 rounded p-4 space-y-2">
                <div class="flex justify-between items-center text-sm">
                  <span class="text-gray-700">Seat Fare</span>
                  <span class="text-gray-900 font-semibold">৳{{ bookingResult.seatNumbers.length * (seatPlan?.baseFare || 0) }}</span>
                </div>
                <div class="flex justify-between items-center text-sm">
                  <span class="text-gray-600">({{ bookingResult.seatNumbers.length }} × ৳{{ seatPlan?.baseFare || 0 }})</span>
                  <span></span>
                </div>
                <div class="flex justify-between items-center text-sm">
                  <span class="text-gray-700">Service Charge</span>
                  <span class="text-gray-900 font-semibold">৳{{ seatPlan?.serviceCharge || 0 }}</span>
                </div>
                <div class="border-t-2 border-gray-300 pt-2 mt-2">
                  <div class="flex justify-between items-center">
                    <span class="text-base font-bold text-gray-900">TOTAL</span>
                    <span class="text-xl font-bold text-green-600">৳{{ bookingResult.totalPrice }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Important Instructions -->
            <div class="mb-4">
              <h3 class="text-sm font-bold text-white bg-yellow-600 px-3 py-2 mb-3">IMPORTANT INSTRUCTIONS</h3>
              
              <div class="bg-yellow-50 border-l-4 border-yellow-400 p-3">
                <ul class="space-y-1 text-xs text-yellow-800">
                  <li class="flex items-start">
                    <span class="mr-2">•</span>
                    <span>Arrive at boarding point 15 minutes early</span>
                  </li>
                  <li class="flex items-start">
                    <span class="mr-2">•</span>
                    <span>Carry a valid photo ID for verification</span>
                  </li>
                  <li class="flex items-start">
                    <span class="mr-2">•</span>
                    <span>Non-transferable and non-refundable</span>
                  </li>
                  <li class="flex items-start">
                    <span class="mr-2">•</span>
                    <span>Keep this ticket until journey end</span>
                  </li>
                </ul>
              </div>
            </div>

            <!-- Booking Date -->
            <div class="mt-4 pt-4 border-t border-gray-200">
              <p class="text-xs text-gray-600">Booking Date:</p>
              <p class="text-sm font-semibold text-gray-900">{{ getCurrentDateTime() }}</p>
            </div>
          </div>
        </div>

        <!-- Ticket Footer -->
        <div class="bg-gray-100 px-6 py-3">
          <p class="text-center text-sm font-semibold text-gray-700">Thank you for choosing our service!</p>
        </div>
      </div>
    </div>
  } @else {
    <!-- Main Booking Confirmation Layout -->
    <div class="max-w-7xl mx-auto px-4 py-6">

      <!-- Global Legend Row (full width) -->
      <div class="w-full mb-4">
        <div class="flex items-center justify-between gap-2 px-4 py-3 text-xs">
          <!-- BOOKED (M) -->
          <div class="flex items-center gap-2 flex-1 justify-center">
            <div class="w-6 h-6 rounded border-2 border-purple-600 bg-purple-500"></div>
            <span class="font-medium text-gray-700">BOOKED (M)</span>
          </div>
          <!-- BOOKED (F) -->
          <div class="flex items-center gap-2 flex-1 justify-center">
            <div class="w-6 h-6 rounded border-2 border-fuchsia-600 bg-fuchsia-500"></div>
            <span class="font-medium text-gray-700">BOOKED (F)</span>
          </div>
          <!-- BLOCKED -->
          <div class="flex items-center gap-2 flex-1 justify-center">
            <div class="w-6 h-6 rounded border-2 border-gray-800 bg-gray-700"></div>
            <span class="font-medium text-gray-700">BLOCKED</span>
          </div>
          <!-- AVAILABLE -->
          <div class="flex items-center gap-2 flex-1 justify-center">
            <div class="w-6 h-6 rounded border-2 border-gray-400 bg-white"></div>
            <span class="font-medium text-gray-700">AVAILABLE</span>
          </div>
          <!-- SELECTED -->
          <div class="flex items-center gap-2 flex-1 justify-center">
            <div class="w-6 h-6 rounded border-2 border-green-600 bg-green-500"></div>
            <span class="font-medium text-gray-700">SELECTED</span>
          </div>
          <!-- SOLD (M) -->
          <div class="flex items-center gap-2 flex-1 justify-center">
            <div class="w-6 h-6 rounded border-2 border-red-600 bg-red-500"></div>
            <span class="font-medium text-gray-700">SOLD (M)</span>
          </div>
          <!-- SOLD (F) -->
          <div class="flex items-center gap-2 flex-1 justify-center">
            <div class="w-6 h-6 rounded border-2 border-pink-600 bg-pink-500"></div>
            <span class="font-medium text-gray-700">SOLD (F)</span>
          </div>
        </div>
      </div>

      <!-- Three Column Layout: Seat Selection | Boarding & Dropping | Confirmation & Summary -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- COLUMN 1: Seat Selection -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <!-- Legend removed - moved to global row above -->

          <!-- Seat Map -->
          @if (loading) {
            <div class="flex items-center justify-center py-12">
              <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          } @else if (seatPlan) {
            <div class="mb-4 bg-gray-100 rounded-lg p-4">
              <!-- Driver Section aligned with right seat column -->
              <div class="flex justify-center gap-3 mb-3">
                <!-- Left side placeholder to keep alignment -->
                <div class="flex gap-2">
                  <div class="w-12 h-12"></div>
                  <div class="w-12 h-12"></div>
                </div>
                <!-- Aisle -->
                <div class="w-8"></div>
                <!-- Right column driver icon + separator line -->
                <div class="flex flex-col items-center">
                  <img src="/driver.png" alt="Driver" class="h-10 w-10 object-contain" />
                  <div class="mt-2 h-px bg-gray-300 w-[calc(6rem+0.5rem)]"></div>
                </div>
              </div>

              <!-- Seat Grid (2x2 layout with aisle) -->
              <div class="space-y-4">
                @for (row of getSeatsByRow() | keyvalue; track row.key) {
                  <div class="flex justify-center gap-8">
                    <!-- Left side seats (2 seats) -->
                    <div class="flex gap-3">
                      @for (seat of row.value.slice(0, 2); track seat.seatId) {
                        <div
                          [class]="getSeatClass(seat)"
                          (click)="toggleSeat(seat)"
                          [title]="'Seat ' + seat.seatNumber"
                        >
                          <img src="/seat.svg" alt="Seat" [class]="'h-10 w-10 object-contain transition-all duration-200 ' + getSeatImageClass(seat)" />
                        </div>
                      }
                    </div>

                    <!-- Aisle -->
                    <div class="w-8"></div>

                    <!-- Right side seats (2 seats) -->
                    <div class="flex gap-3">
                      @for (seat of row.value.slice(2, 4); track seat.seatId) {
                        <div
                          [class]="getSeatClass(seat)"
                          (click)="toggleSeat(seat)"
                          [title]="'Seat ' + seat.seatNumber"
                        >
                          <img src="/seat.svg" alt="Seat" [class]="'h-10 w-10 object-contain transition-all duration-200 ' + getSeatImageClass(seat)" />
                        </div>
                      }
                    </div>
                  </div>
                }
              </div>
            </div>

            <!-- Seat Stats -->
            <div class="grid grid-cols-3 gap-4 text-center text-sm border-t pt-4">
              <div>
                <p class="text-gray-500">Available</p>
                <p class="text-lg font-semibold text-green-600">{{ getAvailableSeatsCount() }}</p>
              </div>
              <div>
                <p class="text-gray-500">Booked</p>
                <p class="text-lg font-semibold text-gray-600">{{ getBookedSeatsCount() }}</p>
              </div>
              <div>
                <p class="text-gray-500">Selected</p>
                <p class="text-lg font-semibold text-blue-600">{{ selectedSeats.length }}</p>
              </div>
            </div>
          }
        </div>

        <!-- COLUMN 2: Boarding & Dropping -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-lg font-semibold text-red-600 mb-6">Boarding & Dropping</h2>

          @if (error) {
            <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
              {{ error }}
            </div>
          }

          <form [formGroup]="bookingForm" class="space-y-6">
            <!-- Boarding Point -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Boarding Point
              </label>
              <select
                formControlName="boardingPoint"
                class="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent bg-gray-50"
              >
                <option value="">Select boarding point</option>
                @if (seatPlan?.boardingPoints) {
                  @for (bp of (seatPlan?.boardingPoints || []); track bp.stopId) {
                    <option [value]="bp.stopId">
                      [{{ bp.time }}] {{ bp.stopName }}
                    </option>
                  }
                }
              </select>
            </div>

            <!-- Dropping Point (Required) -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Dropping Point <span class="text-red-500">*</span>
              </label>

              @if (!droppingPointsExpanded) {
                <button
                  type="button"
                  (click)="toggleDroppingPoints()"
                  class="w-full px-4 py-3 border-2 rounded-md text-left flex items-center justify-between"
                  [class.border-red-500]="bookingForm.get('droppingPoint')?.invalid"
                  [class.border-gray-300]="!bookingForm.get('droppingPoint')?.invalid"
                >
                  <span [class.text-gray-400]="!getSelectedDroppingPoint()" [class.text-gray-900]="getSelectedDroppingPoint()">
                    @if (getSelectedDroppingPoint(); as dp) {
                      [{{ dp.time }}] {{ dp.stopName }}
                    } @else {
                      Select dropping point
                    }
                  </span>
                  <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                  </svg>
                </button>
              } @else {
                <div class="border-2 border-red-500 rounded-md bg-gray-50 p-2 max-h-64 overflow-y-auto">
                  @if (seatPlan?.droppingPoints) {
                    @for (dp of (seatPlan?.droppingPoints || []); track dp.stopId) {
                      <button
                        type="button"
                        (click)="selectDroppingPoint(dp.stopId)"
                        class="w-full px-4 py-3 text-left hover:bg-red-100 rounded-md transition-colors"
                        [class.bg-red-200]="bookingForm.get('droppingPoint')?.value === dp.stopId"
                      >
                        <div class="flex justify-between items-center">
                          <span class="font-medium">[{{ dp.time }}] {{ dp.stopName }}</span>
                        </div>
                      </button>
                    }
                  }
                </div>
              }

              @if (bookingForm.get('droppingPoint')?.invalid && bookingForm.get('droppingPoint')?.touched) {
                <p class="text-red-500 text-sm mt-2">Dropping point is required</p>
              }
            </div>
          </form>
        </div>

        <!-- COLUMN 3: Confirmation & Identification -->
        <div class="bg-white rounded-lg shadow-md p-6">
          

          <form [formGroup]="bookingForm" (ngSubmit)="onSubmit()" class="space-y-6">
            <!-- Mobile Number -->
            <div>
              <label for="mobileNumber" class="block text-sm font-medium text-gray-700 mb-2">
                Mobile Number <span class="text-red-500">*</span>
              </label>
              <input
                id="mobileNumber"
                type="tel"
                formControlName="mobileNumber"
                placeholder="Enter your mobile number"
                class="w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                [class.border-gray-300]="!(bookingForm.get('mobileNumber')?.invalid && bookingForm.get('mobileNumber')?.touched)"
                [class.border-red-500]="bookingForm.get('mobileNumber')?.invalid && bookingForm.get('mobileNumber')?.touched"
              />
              @if (bookingForm.get('mobileNumber')?.invalid && bookingForm.get('mobileNumber')?.touched) {
                <p class="text-red-500 text-sm mt-1">
                  @if (bookingForm.get('mobileNumber')?.errors?.['required']) { Mobile number is required }
                  @else if (bookingForm.get('mobileNumber')?.errors?.['pattern']) { Please enter a valid mobile number (10-15 digits) }
                </p>
              }
            </div>

            <!-- Order Summary -->
            <div class="bg-gray-50 rounded-lg p-4">
              <h3 class="text-base font-semibold text-gray-900 mb-3">Order Summary</h3>
              <div class="space-y-2 text-sm">
                <div class="flex justify-between">
                  <span class="text-gray-600">Seat Fare ({{ selectedSeats.length }} × ৳{{ seatPlan?.baseFare || 0 }})</span>
                  <span class="font-semibold">৳ {{ getSeatFare() }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Service Charge</span>
                  <span class="font-semibold">৳ {{ getServiceCharge() }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">PGW Charge</span>
                  <span class="font-semibold">৳ {{ getPGWCharge() }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Total Discount</span>
                  <span class="font-semibold">- ৳ {{ getTotalDiscount() }}</span>
                </div>
                <div class="border-t pt-2 flex justify-between text-base font-bold">
                  <span>Total Price</span>
                  <span class="text-green-600">৳ {{ getTotalPrice() }}</span>
                </div>
              </div>
            </div>

            <!-- Submit Button -->
            <button
              type="submit"
              [disabled]="!isFormValid() || loading"
              class="w-full py-4 rounded-md font-bold text-lg transition-all duration-200"
              [class.bg-red-600]="isFormValid() && !loading"
              [class.hover:bg-red-700]="isFormValid() && !loading"
              [class.text-white]="isFormValid() && !loading"
              [class.bg-gray-300]="!isFormValid() || loading"
              [class.text-gray-500]="!isFormValid() || loading"
              [class.cursor-not-allowed]="!isFormValid() || loading"
            >
              @if (loading) {
                <span class="flex items-center justify-center gap-2">
                  <svg class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              } @else {
                <span>SUBMIT</span>
              }
            </button>

            <!-- Login & Legal Text -->
            <p class="text-xs text-gray-600 text-center mt-3">
              Already a user? <a href="#" class="text-blue-600 hover:underline">Login with password</a>. By logging in you are agreeing to the
              <a href="#" class="text-blue-600 hover:underline">Terms &amp; Conditions</a>.
            </p>
          </form>
        </div>
      </div>
    </div>
  }
</div>
  `,
  styles: [`
/* Booking Confirmation Component Styles */

/* Smooth transitions for interactive elements */
.seat-transition {
  transition: all 0.2s ease-in-out;
}

/* Seat hover effects */
.seat-available:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

/* Dropdown animation */
.dropdown-enter {
  animation: slideDown 0.3s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Print styles for ticket */
@media print {
  .no-print {
    display: none !important;
  }
  
  body {
    background: white;
    margin: 0;
    padding: 0;
  }

  #ticket-container {
    box-shadow: none !important;
    border: 2px solid #000 !important;
    max-width: 100% !important;
    margin: 0 !important;
    page-break-inside: avoid;
  }

  /* Force two-column layout on print */
  .grid-cols-1 {
    grid-template-columns: repeat(2, 1fr) !important;
  }

  /* Optimize colors for print */
  .bg-gradient-to-r {
    background: #dc2626 !important;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  /* Ensure all colors print correctly */
  * {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  /* Reduce padding for compact one-page layout */
  #ticket-container .p-6 {
    padding: 1rem !important;
  }

  /* Adjust font sizes for better fit */
  #ticket-container h3 {
    font-size: 0.875rem !important;
  }

  /* Ensure borders show in print */
  .border-r-2,
  .border-b-2,
  .border-l-4,
  .border-t-2 {
    border-color: #000 !important;
  }
}

/* Mobile responsive adjustments */
@media (max-width: 640px) {
  .seat-map {
    transform: scale(0.85);
    transform-origin: top center;
  }
}

/* Custom scrollbar for dropdown */
.custom-scrollbar::-webkit-scrollbar {
  width: 8px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #555;
}

/* Legend seat icon swatches using mask to colorize PNG */
.seat-swatch {
  width: 24px;
  height: 24px;
  display: inline-block;
  background-color: #6b7280; /* default gray-500 */
  -webkit-mask-image: url('/seat.png');
  -webkit-mask-repeat: no-repeat;
  -webkit-mask-position: center;
  -webkit-mask-size: contain;
  mask-image: url('/seat.png');
  mask-repeat: no-repeat;
  mask-position: center;
  mask-size: contain;
}

.seat-swatch--available { 
  background-color: transparent; /* transparent fill */
  /* use drop-shadow to mimic an outline of the masked seat icon */
  filter: drop-shadow(0 0 0 #9ca3af); /* gray-400 outline */
}
.seat-swatch--selected { background-color: #22c55e; }  /* green-500 */
.seat-swatch--booked { background-color: #6b7280; }    /* gray-500 */
.seat-swatch--blocked { background-color: #000000; }   /* black */
.seat-swatch--sold { background-color: #8b5cf6; }      /* purple-500 */

/* SVG seat colorization using CSS filters */
.seat-svg-available {
  filter: brightness(0) saturate(100%) invert(71%) sepia(9%) saturate(286%) hue-rotate(182deg) brightness(91%) contrast(87%);
  /* This creates a gray-400 color for available seats */
}

.seat-svg-selected {
  filter: brightness(0) saturate(100%) invert(64%) sepia(98%) saturate(370%) hue-rotate(76deg) brightness(98%) contrast(91%);
  /* This creates a green-500 color for selected seats */
}

.seat-svg-booked {
  filter: brightness(0) saturate(100%) invert(48%) sepia(79%) saturate(2476%) hue-rotate(249deg) brightness(95%) contrast(97%);
  /* This creates a purple-500 color for booked seats */
}

.seat-svg-sold {
  filter: brightness(0) saturate(100%) invert(66%) sepia(74%) saturate(6176%) hue-rotate(316deg) brightness(100%) contrast(96%);
  /* This creates a pink-500 color for sold seats */
}

.seat-svg-blocked {
  filter: brightness(0) saturate(100%) invert(24%) sepia(7%) saturate(837%) hue-rotate(182deg) brightness(96%) contrast(89%);
  /* This creates a gray-700 color for blocked seats */
}
  `]
})
export class BookingConfirmationComponent implements OnInit {
  busScheduleId!: string;
  seatPlan: SeatPlanDto | null = null;
  selectedSeats: SeatDto[] = [];
  bookingForm!: FormGroup;
  loading = false;
  error: string | null = null;
  bookingResult: BookSeatResultDto | null = null;
  droppingPointsExpanded = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private bookingService: BookingService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.busScheduleId = params['id'];
      this.initializeForm();
      this.loadSeatPlan();
    });
  }

  initializeForm(): void {
    this.bookingForm = this.fb.group({
      boardingPoint: ['', Validators.required],
      droppingPoint: ['', Validators.required],
      mobileNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{10,15}$/)]]
    });
  }

  loadSeatPlan(): void {
    this.loading = true;
    this.error = null;

    this.bookingService.getSeatPlan(this.busScheduleId).subscribe({
      next: (seatPlan) => {
        this.seatPlan = seatPlan;
        
        // Pre-select first boarding point if available
        if (seatPlan.boardingPoints && seatPlan.boardingPoints.length > 0) {
          this.bookingForm.patchValue({
            boardingPoint: seatPlan.boardingPoints[0].stopId
          });
        }
        
        // Conditionally require dropping point only if options exist
        const droppingCtrl = this.bookingForm.get('droppingPoint');
        if (seatPlan.droppingPoints && seatPlan.droppingPoints.length > 0) {
          droppingCtrl?.setValidators([Validators.required]);
          droppingCtrl?.updateValueAndValidity();
        } else {
          droppingCtrl?.clearValidators();
          droppingCtrl?.updateValueAndValidity();
        }
        
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load seat plan. Please try again.';
        this.loading = false;
        this.toast.error(this.error);
        console.error('Error loading seat plan:', err);
      }
    });
  }

  // Seat Selection Methods
  toggleSeat(seat: SeatDto): void {
    if (seat.isBooked || seat.isBlocked || seat.isSold) {
      return; // Cannot select unavailable seats
    }

    const index = this.selectedSeats.findIndex(s => s.seatNumber === seat.seatNumber);
    if (index > -1) {
      this.selectedSeats.splice(index, 1); // Deselect
    } else {
      this.selectedSeats.push(seat); // Select
    }
  }

  isSeatSelected(seat: SeatDto): boolean {
    return this.selectedSeats.some(s => s.seatNumber === seat.seatNumber);
  }

  getSeatStatus(seat: SeatDto): 'booked' | 'blocked' | 'sold' | 'selected' | 'available' {
    if (seat.isBooked) return 'booked';
    if (seat.isBlocked) return 'blocked';
    if (seat.isSold) return 'sold';
    if (this.isSeatSelected(seat)) return 'selected';
    return 'available';
  }

  getSeatClass(seat: SeatDto): string {
    const status = this.getSeatStatus(seat);
    const baseClasses = 'cursor-pointer transition-all duration-200';
    
    switch (status) {
      case 'booked':
        return `${baseClasses} opacity-50 cursor-not-allowed`;
      case 'blocked':
        return `${baseClasses} opacity-50 cursor-not-allowed`;
      case 'sold':
        return `${baseClasses} opacity-50 cursor-not-allowed`;
      case 'selected':
        return `${baseClasses} scale-110`;
      case 'available':
        return `${baseClasses} hover:scale-105`;
      default:
        return baseClasses;
    }
  }

  getSeatImageClass(seat: SeatDto): string {
    const status = this.getSeatStatus(seat);
    // Return filter classes that will colorize the SVG properly
    switch (status) {
      case 'booked':
        return 'seat-svg-booked'; // BOOKED (M) - purple
      case 'blocked':
        return 'seat-svg-blocked'; // BLOCKED - dark gray
      case 'sold':
        return 'seat-svg-sold'; // SOLD (M) - pink/red
      case 'selected':
        return 'seat-svg-selected'; // SELECTED - green
      case 'available':
        return 'seat-svg-available'; // AVAILABLE - light gray outline
      default:
        return '';
    }
  }

  getSeatsByRow(): Map<number, SeatDto[]> {
    if (!this.seatPlan) return new Map();
    
    const seatsByRow = new Map<number, SeatDto[]>();
    this.seatPlan.seats.forEach(seat => {
      if (!seatsByRow.has(seat.row)) {
        seatsByRow.set(seat.row, []);
      }
      seatsByRow.get(seat.row)!.push(seat);
    });

    // Sort seats within each row by seat number
    seatsByRow.forEach(seats => {
      seats.sort((a, b) => a.seatNumber - b.seatNumber);
    });

    return seatsByRow;
  }

  // Price Calculation Methods
  getSeatFare(): number {
    if (!this.seatPlan) return 0;
    return this.selectedSeats.length * this.seatPlan.baseFare;
  }

  getServiceCharge(): number {
    if (!this.seatPlan) return 0;
    return this.selectedSeats.length * this.seatPlan.serviceCharge;
  }

  // Placeholder for payment gateway charge (PGW). Adjust when backend provides this.
  getPGWCharge(): number {
    return 0; // e.g., could be a percentage of subtotal in future
  }

  // Placeholder for discount. Adjust when backend provides discount logic.
  getTotalDiscount(): number {
    return 0;
  }

  getTotalPrice(): number {
    return this.getSeatFare() + this.getServiceCharge() + this.getPGWCharge() - this.getTotalDiscount();
  }

  // Form Methods
  toggleDroppingPoints(): void {
    this.droppingPointsExpanded = !this.droppingPointsExpanded;
  }

  selectDroppingPoint(stopId: string): void {
    this.bookingForm.patchValue({ droppingPoint: stopId });
    this.droppingPointsExpanded = false;
  }

  getSelectedBoardingPoint(): RouteStopDto | undefined {
    if (!this.seatPlan) return undefined;
    const boardingId = this.bookingForm.get('boardingPoint')?.value;
    return this.seatPlan.boardingPoints?.find(bp => bp.stopId === boardingId);
  }

  getSelectedDroppingPoint(): RouteStopDto | undefined {
    if (!this.seatPlan) return undefined;
    const droppingId = this.bookingForm.get('droppingPoint')?.value;
    return this.seatPlan.droppingPoints?.find(dp => dp.stopId === droppingId);
  }

  isFormValid(): boolean {
    // If dropping points are not provided by backend, don't block submission on it
    const requireDropping = !!this.seatPlan?.droppingPoints && this.seatPlan.droppingPoints.length > 0;
    const boardingValid = !!this.bookingForm.get('boardingPoint')?.valid;
    const droppingValid = requireDropping ? !!this.bookingForm.get('droppingPoint')?.valid : true;
    const mobileValid = !!this.bookingForm.get('mobileNumber')?.valid;
    return boardingValid && droppingValid && mobileValid && this.selectedSeats.length > 0;
  }

  onSubmit(): void {
    if (!this.isFormValid()) {
      // Mark all fields as touched to show validation errors
      Object.keys(this.bookingForm.controls).forEach(key => {
        this.bookingForm.get(key)?.markAsTouched();
      });
      
      if (this.selectedSeats.length === 0) {
        this.toast.error('Please select at least one seat');
      }
      return;
    }

    this.loading = true;
    this.error = null;

    const bookingData: BookSeatInputDto = {
      busScheduleId: this.busScheduleId,
      seatNumbers: this.selectedSeats.map(s => s.seatNumber),
      passengerName: 'Passenger', // We'll use phone as identifier
      passengerPhone: this.bookingForm.value.mobileNumber,
      boardingPointId: this.bookingForm.value.boardingPoint,
      droppingPointId: this.bookingForm.value.droppingPoint
    };

    this.bookingService.bookSeats(bookingData).subscribe({
      next: (result) => {
        this.bookingResult = result;
        this.loading = false;
        this.toast.success('Booking confirmed successfully!');
        // Navigate to success page or show success state
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to book seats. Please try again.';
        this.toast.error(this.error ?? 'Unknown error');
        this.loading = false;
        console.error('Error booking seats:', err);
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/search']);
  }

  goToSearch(): void {
    this.router.navigate(['/search']);
  }

  printTicket(): void {
    window.print();
  }

  // Utility Methods
  getAvailableSeatsCount(): number {
    if (!this.seatPlan) return 0;
    return this.seatPlan.seats.filter(s => !s.isBooked && !s.isBlocked && !s.isSold).length;
  }

  getBookedSeatsCount(): number {
    if (!this.seatPlan) return 0;
    return this.seatPlan.seats.filter(s => s.isBooked).length;
  }

  // Helper methods for ticket display
  getPassengerName(): string {
    // Since we don't collect passenger name in this form, we use a placeholder
    return 'Passenger';
  }

  getMobileNumber(): string {
    return this.bookingForm?.get('mobileNumber')?.value || 'N/A';
  }

  getCurrentDate(): string {
    const date = new Date();
    return date.toLocaleDateString('en-GB', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric' 
    });
  }

  getCurrentDateTime(): string {
    const date = new Date();
    return date.toLocaleDateString('en-GB', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
