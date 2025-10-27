import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BusService } from '../../services/bus.service';
import { AvailableBusDto, BusFilterOptions, BusSortBy, DepartureTimeWindow } from '../../models/bus.model';

@Component({
  selector: 'app-search-buses',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
<div class="min-h-screen">
  <!-- Top hero section with 40% screen height background image -->
  <div class="search-hero w-full"></div>

  <!-- Search form card or Compact header (floats over the hero) - Always in same position -->
  <div class="relative">
    <div class="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="card w-full mb-8 search-card-overlap" [class.modify-search-card]="searched">
        
        <!-- BEFORE SEARCH: Full Search Form -->
        @if (!searched) {
        <form [formGroup]="searchForm" (ngSubmit)="onSearch()" class="space-y-4">
        <!-- Two attached groups with a small gap -->
        <div class="flex flex-col md:flex-row md:items-stretch gap-4">
          <!-- Group 1: From + To (attached) -->
          <div class="flex-1 basis-0 min-w-0 relative">
            <div class="flex gap-0 items-stretch">
              <!-- From -->
              <div class="flex-1 basis-0 min-w-0">
                <label for="from" class="input-label">GOING FROM</label>
                <input
                  id="from"
                  type="text"
                  formControlName="from"
                  placeholder="Dhaka"
                  class="input-field w-full rounded-r-none border-r-0"
                  list="citiesList"
                  [class.!border-primary]="searchForm.get('from')?.invalid && searchForm.get('from')?.touched"
                />
                @if (searchForm.get('from')?.invalid && searchForm.get('from')?.touched) {
                  <p class="text-primary text-xs mt-1">Origin is required</p>
                } @else {
                  <p class="text-transparent text-xs mt-1">placeholder</p>
                }
              </div>

              <!-- To -->
              <div class="flex-1 basis-0 min-w-0 -ml-px">
                <label for="to" class="input-label">GOING TO</label>
                <input
                  id="to"
                  type="text"
                  formControlName="to"
                  placeholder="Cox's Bazar"
                  class="input-field w-full rounded-l-none"
                  list="citiesList"
                  [class.!border-primary]="searchForm.get('to')?.invalid && searchForm.get('to')?.touched"
                />
                @if (searchForm.get('to')?.invalid && searchForm.get('to')?.touched) {
                  <p class="text-primary text-xs mt-1">Destination is required</p>
                } @else {
                  <p class="text-transparent text-xs mt-1">placeholder</p>
                }
              </div>
            </div>

            <!-- Swap Icon centered vertically and overlaid between From/To (md+) -->
            <div class="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
              <button type="button" class="swap-icon" (click)="swapLocations()" aria-label="Swap locations">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Group 2: Journey Date + Return Date (attached) -->
          <div class="flex-1 basis-0 min-w-0">
            <div class="flex gap-0 items-stretch">
              <!-- Journey Date -->
              <div class="flex-1 basis-0 min-w-0">
                <label for="journeyDate" class="input-label">JOURNEY DATE</label>
                <input
                  id="journeyDate"
                  type="date"
                  formControlName="journeyDate"
                  class="input-field date-input w-full rounded-r-none border-r-0"
                  [attr.min]="minDate"
                  [class.!border-primary]="searchForm.get('journeyDate')?.invalid && searchForm.get('journeyDate')?.touched"
                />
                @if (searchForm.get('journeyDate')?.invalid && searchForm.get('journeyDate')?.touched) {
                  <p class="text-primary text-xs mt-1">Journey date is required</p>
                } @else {
                  <p class="text-transparent text-xs mt-1">placeholder</p>
                }
              </div>

              <!-- Return Date (Optional) -->
              <div class="flex-1 basis-0 min-w-0 -ml-px">
                <label for="returnDate" class="input-label">RETURN DATE</label>
                <input
                  id="returnDate"
                  type="date"
                  formControlName="returnDate"
                  class="input-field date-input w-full rounded-l-none"
                />
                <p class="text-transparent text-xs mt-1">placeholder</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Cities datalist for From/To inputs -->
        <datalist id="citiesList">
          @for (city of cities; track city) {
            <option [value]="city"></option>
          }
        </datalist>

        <!-- Trending Searches (below fields) -->
        <div class="mt-2">
          <p class="text-sm text-text-secondary mb-3">Trending Searches</p>
          <div class="flex flex-wrap gap-2">
            <span class="tag-muted" (click)="fillTrendingSearch('Dhaka', 'Cox\\'s Bazar')">Dhaka to Cox's Bazar</span>
            <span class="tag-muted" (click)="fillTrendingSearch('Dhaka', 'Sylhet')">Dhaka to Sylhet</span>
            <span class="tag-muted" (click)="fillTrendingSearch('Chittagong', 'Dhaka')">Chittagong to Dhaka</span>
            <span class="tag-muted" (click)="fillTrendingSearch('Dhaka', 'Rajshahi')">Dhaka to Rajshahi</span>
          </div>
        </div>

        <!-- Search Button -->
        <button
          type="submit"
          [disabled]="loading"
          class="btn-primary w-full md:w-auto mt-4 mx-auto block"
        >
          @if (loading) {
            <span>SEARCHING...</span>
          } @else {
            <span>SEARCH BUS</span>
          }
        </button>
      </form>
        }
        
        <!-- AFTER SEARCH: Compact Search Header (loading or results) -->
        @if (searched) {
          @if (loading) {
            <!-- Loading State -->
            <div class="text-center py-8">
              <p class="text-lg font-semibold text-text-primary">Searching for buses...</p>
            </div>
          } @else {
            <!-- Search Results Header - Compact version -->
            <div class="space-y-3">
              <!-- Top Row: Route Info + Modify Button -->
              <div class="flex flex-col md:flex-row md:justify-between md:items-center gap-4 pb-3 border-b-2 border-gray-300">
                <div class="flex flex-col md:flex-row md:items-center gap-3">
                  <div class="flex items-center gap-2">
                    <span class="route-text">{{ searchForm.value.from }}</span>
                    <svg class="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                    </svg>
                    <span class="route-text">{{ searchForm.value.to }}</span>
                  </div>
                  <div class="flex items-center gap-2 text-gray-700">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                    </svg>
                    <span class="date-text">{{ searchForm.value.journeyDate | date: 'EEE, MMM d, y' }}</span>
                  </div>
                </div>
                <button type="button" (click)="modifySearch()" class="modify-btn">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                  </svg>
                  <span>MODIFY SEARCH</span>
                </button>
              </div>

              <!-- Statistics Row - Compact version -->
              <div class="grid grid-cols-3 gap-6 pb-4">
                <div class="stat-card">
                  <div class="stat-icon-wrapper bg-blue-100">
                    <svg class="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"/>
                    </svg>
                  </div>
                  <p class="stat-value-compact">{{ buses.length }}</p>
                  <p class="stat-label">Buses Found</p>
                </div>
                <div class="stat-card">
                  <div class="stat-icon-wrapper bg-green-100">
                    <svg class="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                    </svg>
                  </div>
                  <p class="stat-value-compact">{{ getUniqueOperators() }}</p>
                  <p class="stat-label">Operators</p>
                </div>
                <div class="stat-card">
                  <div class="stat-icon-wrapper bg-purple-100">
                    <svg class="w-7 h-7 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                    </svg>
                  </div>
                  <p class="stat-value-compact">{{ getTotalSeatsAvailable() }}</p>
                  <p class="stat-label">Seats Available</p>
                </div>
              </div>
            </div>
          }
        }
      </div>
    </div>
  </div>

  <!-- Main content area with white background (below hero and card) -->
  <div class="bg-white py-8">
    <div class="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
    
    <!-- Filter/Sort Section - Appears after search -->
    @if (searched && !loading) {
      <div class="flex flex-wrap items-center gap-4 mb-6 bg-white py-4 px-6 rounded-lg shadow-sm border border-gray-200">
        <!-- Sort By Label with Icon -->
        <div class="flex items-center gap-2">
          <svg class="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"/>
          </svg>
          <span class="filter-sort-label text-primary">SORT BY</span>
        </div>

        <!-- Separator -->
        <div class="w-px h-6 bg-gray-300"></div>

        <!-- Departure Time -->
        <button type="button" class="filter-option" [class.active]="sortBy === 'departure'" (click)="setSortBy('departure')">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <span>DEPARTURE TIME</span>
        </button>

        <!-- Available Seats -->
        <button type="button" class="filter-option" [class.active]="sortBy === 'seats'" (click)="setSortBy('seats')">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
          </svg>
          <span>AVAILABLE SEATS</span>
        </button>

        <!-- Fare -->
        <button type="button" class="filter-option" [class.active]="sortBy === 'fare'" (click)="setSortBy('fare')">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <span>FARE</span>
        </button>

        <!-- Special Offers -->
        <button type="button" class="filter-option" [class.active]="filters.specialOffersOnly" (click)="toggleSpecialOffers()">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/>
          </svg>
          <span>SPECIAL OFFERS</span>
        </button>

        <!-- Spacer to push Filter By to the right on larger screens -->
        <div class="hidden md:block flex-1"></div>

        <!-- Filter By Button -->
        <div class="relative">
          <button type="button" class="filter-by-btn" (click)="toggleFilterPanel()">
            <span>FILTER BY</span>
          </button>
          <!-- Filter panel dropdown -->
          @if (showFilterPanel) {
            <div class="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-4">
              <div class="space-y-4">
                <!-- Departure time windows -->
                <div>
                  <p class="text-xs font-semibold text-gray-500 mb-2">DEPARTURE TIME</p>
                  <div class="grid grid-cols-2 gap-2">
                    <label class="inline-flex items-center gap-2 text-sm">
                      <input type="checkbox" [checked]="filters.timeWindows?.includes('morning')" (change)="toggleTimeWindow('morning')" />
                      <span>Morning (6 AM - 12 PM)</span>
                    </label>
                    <label class="inline-flex items-center gap-2 text-sm">
                      <input type="checkbox" [checked]="filters.timeWindows?.includes('afternoon')" (change)="toggleTimeWindow('afternoon')" />
                      <span>Afternoon (12 PM - 5 PM)</span>
                    </label>
                    <label class="inline-flex items-center gap-2 text-sm">
                      <input type="checkbox" [checked]="filters.timeWindows?.includes('evening')" (change)="toggleTimeWindow('evening')" />
                      <span>Evening (5 PM - 9 PM)</span>
                    </label>
                    <label class="inline-flex items-center gap-2 text-sm">
                      <input type="checkbox" [checked]="filters.timeWindows?.includes('night')" (change)="toggleTimeWindow('night')" />
                      <span>Night (9 PM - 6 AM)</span>
                    </label>
                  </div>
                </div>

                <!-- Min available seats -->
                <div>
                  <p class="text-xs font-semibold text-gray-500 mb-2">MINIMUM SEATS AVAILABLE</p>
                  <div class="flex items-center gap-2">
                    <input type="number" min="1" class="w-24 border rounded px-2 py-1" [value]="filters.minSeats ?? ''" (input)="updateMinSeats(($any($event.target).valueAsNumber))" />
                    <span class="text-xs text-gray-500">or more</span>
                  </div>
                </div>

                <!-- Special offers only -->
                <div class="flex items-center justify-between">
                  <label class="inline-flex items-center gap-2 text-sm">
                    <input type="checkbox" [checked]="filters.specialOffersOnly" (change)="toggleSpecialOffers()" />
                    <span>Special offers only</span>
                  </label>
                  @if (filters.specialOffersOnly && buses.length > 0) {
                    <span class="text-xs text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded">Showing lowest priced buses</span>
                  }
                </div>

                <!-- Actions -->
                <div class="flex items-center justify-end gap-2 pt-2 border-t">
                  <button type="button" class="text-sm text-gray-600 hover:text-gray-800" (click)="resetFilters()">Reset</button>
                  <button type="button" class="btn-primary px-3 py-1.5" (click)="toggleFilterPanel()">Done</button>
                </div>
              </div>
            </div>
          }
        </div>
      </div>
    }
    
    <!-- Error Message -->
    @if (error) {
      <div class="max-w-3xl mx-auto bg-red-50 border border-primary text-primary px-4 py-3 rounded-card mb-8">
        {{ error }}
      </div>
    }

    <!-- Search Results -->
    @if (searched && !loading) {
      <!-- Results List -->
      <div>
        <h2 class="text-xl font-bold text-text-primary mb-4">
          Available Buses
        </h2>

        @if (buses.length === 0) {
          <div class="card-static text-center py-12">
            <svg class="mx-auto h-12 w-12 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
            <h3 class="mt-2 text-lg font-bold text-text-primary">No buses found for selected date</h3>
            <p class="mt-1 text-text-secondary">Try adjusting your search criteria.</p>

            @if (suggestedDate) {
              <div class="mt-4 inline-flex items-center gap-3 bg-blue-50 border border-blue-200 rounded-md px-4 py-3">
                <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
                <span class="text-sm text-blue-800">Earliest available: <strong>{{ suggestedDate | date: 'EEE, MMM d, y' }}</strong></span>
                <button type="button" class="btn-primary px-3 py-1" (click)="applySuggestedDate()">Search this date</button>
              </div>
            }
          </div>
        } @else {
          <!-- Bus Listing Cards -->
          <div class="space-y-4">
            @for (bus of buses; track bus.busScheduleId) {
              <div class="listing-card">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <!-- Left: Bus Info -->
                  <div class="flex flex-col justify-center h-full">
                    <h3 class="operator-name">{{ bus.companyName }}</h3>
                    <p class="sub-text">{{ bus.busName }}</p>
                    
                    <!-- City Code (e.g., DHA-CHA) -->
                    <p class="text-sm font-semibold text-gray-700 mt-2">
                      {{ getRouteCode(bus.from, bus.to) }}
                    </p>
                    
                    <!-- AC/Non-AC Badge -->
                    <div class="inline-flex items-center gap-1.5 border border-gray-400 text-gray-600 bg-gray-50 px-2.5 py-1 rounded mt-2 w-fit">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                      </svg>
                      <span class="text-xs font-semibold">{{ isAC(bus) ? 'AC' : 'Non-AC' }}</span>
                    </div>
                    
                    <p class="sub-text italic mt-2 text-red-600 cursor-pointer hover:underline" (click)="openCancellationModal()">
                      Cancellation policy
                    </p>
                  </div>

                  <!-- Middle: Schedule Info -->
                  <div class="flex flex-col md:flex-row items-center justify-between h-full">
                    <div class="flex flex-col items-center md:items-start">
                      <span class="text-xs text-gray-500 uppercase tracking-wide mb-1">Starting</span>
                      <span class="font-semibold text-lg">{{ formatTimeToAMPM(bus.startTime) }}</span>
                      <span class="text-sm text-gray-600 mt-1">{{ bus.startingCounter || bus.from }}</span>
                    </div>
                    <div class="flex flex-col items-center mx-4">
                      <!-- Bus Icon -->
                      <img src="/bus.png" alt="Bus" class="w-10 h-10 -mb-2" />
                      <!-- Horizontal line under bus icon (road) -->
                      <div class="w-16 h-0.5 bg-gray-400 mb-3"></div>
                      <!-- Seats Left Info -->
                      <span class="text-sm text-gray-500">
                        Seats Left: <span class="font-bold text-primary">{{ bus.seatsLeft }}</span>
                      </span>
                    </div>
                    <div class="flex flex-col items-center md:items-end">
                      <span class="text-xs text-gray-500 uppercase tracking-wide mb-1">Arrival</span>
                      <span class="font-semibold text-lg">{{ formatTimeToAMPM(bus.arrivalTime) }}</span>
                      <span class="text-sm text-gray-600 mt-1">{{ bus.arrivalCounter || bus.to }}</span>
                    </div>
                  </div>

                  <!-- Right: Charges Info, Price & CTA -->
                  <div class="flex flex-col items-start md:items-end justify-between h-full">
                    <!-- Top: Charges info badge and price -->
                    <div class="flex flex-col items-start md:items-end gap-2">
                      <!-- Extra charges info badge -->
                      <div class="inline-flex items-center gap-2 border border-green-600 text-green-700 bg-green-50 px-3 py-1 rounded-md">
                        <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span class="text-xs font-semibold">No extra charges</span>
                      </div>

                      <!-- Price -->
                      <p class="price-display py-3">৳{{ bus.price }}</p>
                      @if (isSpecialOffer(bus)) {
                        <span class="inline-flex items-center gap-1 text-xs font-semibold text-red-700 bg-red-50 border border-red-200 rounded px-2 py-0.5">Special offer</span>
                      }
                    </div>

                    <!-- CTA -->
                    <button 
                      (click)="viewSeatPlan(bus.busScheduleId)" 
                      [disabled]="bus.seatsLeft === 0"
                      class="btn-primary w-full md:w-auto mt-4 md:mt-0"
                      [class.!bg-gray-400]="bus.seatsLeft === 0"
                      [class.!cursor-not-allowed]="bus.seatsLeft === 0"
                    >
                      VIEW SEATS
                    </button>
                  </div>
                </div>
              </div>
            }
          </div>
        }
      </div>
    }
    </div>
  </div>

  <!-- Cancellation Policy Modal -->
  @if (showCancellationModal) {
    <div class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <!-- Backdrop -->
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" (click)="closeCancellationModal()"></div>
      
      <!-- Modal Container -->
      <div class="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
        <div class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl">
          <!-- Modal Header -->
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="flex items-start justify-between border-b border-gray-200 pb-4">
              <div class="flex items-center">
                <div class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                  <svg class="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h3 class="ml-3 text-lg font-semibold leading-6 text-gray-900" id="modal-title">
                  Cancellation Policy
                </h3>
              </div>
              <button type="button" class="text-gray-400 hover:text-gray-500" (click)="closeCancellationModal()">
                <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <!-- Modal Content -->
            <div class="mt-6">
              <div class="space-y-4 text-sm text-gray-600">
                <!-- Refund Policy -->
                <div>
                  <h4 class="font-semibold text-gray-900 mb-2 flex items-center">
                    <svg class="w-5 h-5 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Refund Schedule
                  </h4>
                  <ul class="ml-7 space-y-2">
                    <li class="flex items-start">
                      <span class="font-medium text-green-600 mr-2">•</span>
                      <span><strong>More than 48 hours before departure:</strong> 90% refund (10% cancellation fee)</span>
                    </li>
                    <li class="flex items-start">
                      <span class="font-medium text-yellow-600 mr-2">•</span>
                      <span><strong>24-48 hours before departure:</strong> 70% refund (30% cancellation fee)</span>
                    </li>
                    <li class="flex items-start">
                      <span class="font-medium text-orange-600 mr-2">•</span>
                      <span><strong>12-24 hours before departure:</strong> 50% refund (50% cancellation fee)</span>
                    </li>
                    <li class="flex items-start">
                      <span class="font-medium text-red-600 mr-2">•</span>
                      <span><strong>Less than 12 hours before departure:</strong> No refund</span>
                    </li>
                  </ul>
                </div>

                <!-- Return Ticket Policy -->
                <div class="pt-2">
                  <h4 class="font-semibold text-gray-900 mb-2 flex items-center">
                    <svg class="w-5 h-5 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                    </svg>
                    Return Ticket Policy
                  </h4>
                  <ul class="ml-7 space-y-2">
                    <li class="flex items-start">
                      <span class="font-medium text-blue-600 mr-2">•</span>
                      <span>Return tickets must be cancelled separately</span>
                    </li>
                    <li class="flex items-start">
                      <span class="font-medium text-blue-600 mr-2">•</span>
                      <span>Same refund schedule applies to return journey</span>
                    </li>
                    <li class="flex items-start">
                      <span class="font-medium text-blue-600 mr-2">•</span>
                      <span>Cancellation of outbound journey does not affect return ticket</span>
                    </li>
                  </ul>
                </div>

                <!-- Important Notes -->
                <div class="pt-2 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <h4 class="font-semibold text-gray-900 mb-2 flex items-center">
                    <svg class="w-5 h-5 mr-2 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Important Notes
                  </h4>
                  <ul class="ml-7 space-y-1 text-xs">
                    <li>• Refunds will be processed within 5-7 business days</li>
                    <li>• Original payment method will be used for refund</li>
                    <li>• No-show passengers are not eligible for any refund</li>
                    <li>• Service charges and payment gateway fees are non-refundable</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <!-- Modal Footer -->
          <div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
            <button
              type="button"
              class="inline-flex w-full justify-center rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-700 sm:ml-3 sm:w-auto"
              (click)="closeCancellationModal()"
            >
              I Understand
            </button>
            <button
              type="button"
              class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
              (click)="closeCancellationModal()"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  }
</div>
  `,
  styles: [`
/* Component-specific styles */

/* Top hero section with image (40% viewport height) */
:host ::ng-deep .search-hero {
	height: 40vh;
	min-height: 260px;
	background-image: url('/search_bg.jpg');
	background-size: cover;
	background-position: center;
	background-repeat: no-repeat;
    position: relative;
}

/* Search form card background */
:host ::ng-deep .card {
	background-color: white !important;
	box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

/* Modify search section background with 50% opacity */
:host ::ng-deep .card.modify-search-card {
	background-color: rgba(255, 255, 255, 0.5) !important;
	backdrop-filter: blur(8px);
	-webkit-backdrop-filter: blur(8px);
}

/* Route text styling */
:host ::ng-deep .route-text {
	font-size: 1.5rem; /* text-2xl */
	font-weight: 700; /* font-bold */
	color: #1f2937; /* gray-800 */
	font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
}

/* Date text styling */
:host ::ng-deep .date-text {
	font-size: 0.9375rem; /* ~text-base */
	font-weight: 600; /* font-semibold */
	color: #4b5563; /* gray-700 */
}

/* Modify button styling */
:host ::ng-deep .modify-btn {
	display: inline-flex;
	align-items: center;
	gap: 0.5rem;
	background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%);
	color: white;
	padding: 0.75rem 1.5rem;
	border-radius: 0.5rem;
	font-weight: 700;
	font-size: 0.875rem;
	letter-spacing: 0.05em;
	transition: all 0.2s ease;
	box-shadow: 0 4px 6px -1px rgba(220, 38, 38, 0.3), 0 2px 4px -1px rgba(220, 38, 38, 0.2);
	border: none;
	cursor: pointer;
}

:host ::ng-deep .modify-btn:hover {
	background: linear-gradient(135deg, #991b1b 0%, #7f1d1d 100%);
	transform: translateY(-2px);
	box-shadow: 0 8px 12px -2px rgba(220, 38, 38, 0.4), 0 4px 6px -1px rgba(220, 38, 38, 0.3);
}

:host ::ng-deep .modify-btn:active {
	transform: translateY(0);
}

/* Statistics section styling */
:host ::ng-deep .statistics-section {
	padding-top: 1rem;
	padding-bottom: 0.5rem;
}

:host ::ng-deep .stat-card {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 0.5rem;
}

:host ::ng-deep .stat-icon-wrapper {
	padding: 0.75rem;
	border-radius: 0.75rem;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	margin-bottom: 0.25rem;
}

:host ::ng-deep .stat-value {
	font-size: 2.25rem; /* text-4xl */
	font-weight: 800; /* font-extrabold */
	color: #000000; /* Pure black */
	line-height: 1;
	font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
}

:host ::ng-deep .stat-value-compact {
	font-size: 1.875rem; /* text-3xl */
	font-weight: 800; /* font-extrabold */
	color: #000000; /* Pure black */
	line-height: 1;
	font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
}

:host ::ng-deep .stat-label {
	font-size: 0.8125rem; /* ~text-sm */
	font-weight: 600; /* font-semibold */
	color: #374151; /* gray-700 */
	text-transform: uppercase;
	letter-spacing: 0.05em; /* tracking-wide */
}

/* Filter/Sort Section Styles */
:host ::ng-deep .filter-sort-label {
	font-size: 0.875rem; /* text-sm */
	font-weight: 700; /* font-bold */
	letter-spacing: 0.05em;
}

:host ::ng-deep .filter-option {
	display: inline-flex;
	align-items: center;
	gap: 0.5rem;
	padding: 0.5rem 0.75rem;
	background-color: transparent;
	border: none;
	color: #6b7280; /* gray-500 */
	font-size: 0.8125rem; /* ~text-sm */
	font-weight: 600; /* font-semibold */
	letter-spacing: 0.025em;
	cursor: pointer;
	transition: all 0.2s ease;
	border-radius: 0.375rem;
}

:host ::ng-deep .filter-option:hover {
	background-color: #f3f4f6; /* gray-100 */
	color: #374151; /* gray-700 */
}

:host ::ng-deep .filter-option.active {
	background-color: #fee2e2; /* red-100 */
	color: #dc2626; /* red-600 */
}

:host ::ng-deep .filter-by-btn {
	display: inline-flex;
	align-items: center;
	padding: 0.5rem 1rem;
	border: 2px solid #dc2626; /* red-600 */
	color: #dc2626; /* red-600 */
	background-color: white;
	border-radius: 0.375rem;
	font-size: 0.8125rem; /* ~text-sm */
	font-weight: 700; /* font-bold */
	letter-spacing: 0.05em;
	cursor: pointer;
	transition: all 0.2s ease;
}

:host ::ng-deep .filter-by-btn:hover {
	background-color: #dc2626; /* red-600 */
	color: white;
}

/* Make the search card overlap the hero image */
:host ::ng-deep .search-card-overlap {
		position: relative;
		z-index: 50; /* Ensure it's above the hero */
		margin-top: -6rem; /* Pull further up over the hero */
}

@media (min-width: 768px) { /* md */
	:host ::ng-deep .search-card-overlap {
		margin-top: -8rem;
	}
}

@media (min-width: 1024px) { /* lg */
	:host ::ng-deep .search-card-overlap {
		margin-top: -10rem;
	}
}

/* Ensure all result cards also have white background */
:host ::ng-deep .card-static,
:host ::ng-deep .listing-card,
:host ::ng-deep .search-banner {
	background-color: white;
}

/* Make the From/To/Journey inputs taller for better touch targets */
.input-field {
	padding-top: 1.1rem;
	padding-bottom: 1.1rem;
	min-height: 3.5rem;
	border-color: red;
	/* Increase left padding for better visual spacing */
	padding-left: 2rem; /* ~px-5 */
}

/* Keep date inputs consistent with the same height */
.date-input.input-field {
	padding-top: 1.1rem;
	padding-bottom: 1.1rem;
	min-height: 3.5rem;
	border-color: red;
	/* Match increased left padding */
	padding-left: 2rem; /* ~px-5 */
}
  `]
})
export class SearchBusesComponent implements OnInit {
  searchForm!: FormGroup;
  // Visible list after applying filters and sorting
  buses: AvailableBusDto[] = [];
  // Raw results from API, unmodified
  private originalBuses: AvailableBusDto[] = [];
  cities: string[] = [];
  minDate: string = '';
  suggestedDate: string | null = null;
  loading = false;
  error: string | null = null;
  searched = false;
  sortBy: BusSortBy = 'departure';
  showCancellationModal = false;
  // Filter panel state
  showFilterPanel = false;
  filters: BusFilterOptions = {
    sortBy: 'departure',
    minSeats: undefined,
    timeWindows: [],
    specialOffersOnly: false
  };
  // Cached threshold for special offers (25th percentile price among original results)
  private specialOfferPriceThreshold: number | null = null;

  constructor(
    private fb: FormBuilder,
    private busService: BusService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    // Set min date (today) and default journeyDate (tomorrow)
    const today = new Date();
    const tomorrow = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
    this.minDate = this.formatForDateInput(today);
    this.searchForm.patchValue({ journeyDate: this.formatForDateInput(tomorrow) });
    // Load cities for dropdown/datalist
    this.busService.getCities().subscribe({
      next: (cities) => {
        this.cities = cities || [];
      },
      error: (err) => {
        console.error('Failed to load cities', err);
        this.cities = [];
      }
    });
  }

  initializeForm(): void {
    this.searchForm = this.fb.group({
      from: ['', Validators.required],
      to: ['', Validators.required],
      journeyDate: ['', Validators.required],
      returnDate: ['']
    });
  }

  swapLocations(): void {
    const from = this.searchForm.get('from')?.value;
    const to = this.searchForm.get('to')?.value;
    this.searchForm.patchValue({
      from: to,
      to: from
    });
  }

  fillTrendingSearch(from: string, to: string): void {
    this.searchForm.patchValue({ from, to });
  }

  modifySearch(): void {
    this.searched = false;
    this.buses = [];
  }

  setSortBy(sortType: string): void {
    this.sortBy = (sortType as BusSortBy);
    this.filters.sortBy = this.sortBy;
    this.applyFiltersAndSorting();
  }

  private sortBuses(sortBy: BusSortBy): void {
    switch (sortBy) {
      case 'departure':
        this.buses.sort((a, b) => a.startTime.localeCompare(b.startTime));
        break;
      case 'arrival':
        this.buses.sort((a, b) => a.arrivalTime.localeCompare(b.arrivalTime));
        break;
      case 'fare':
        this.buses.sort((a, b) => a.price - b.price);
        break;
      case 'seats':
        this.buses.sort((a, b) => b.seatsLeft - a.seatsLeft);
        break;
    }
  }

  getUniqueOperators(): number {
    const uniqueOperators = new Set(this.buses.map(bus => bus.companyName));
    return uniqueOperators.size;
  }

  getTotalSeatsAvailable(): number {
    return this.buses.reduce((sum, bus) => sum + (bus.seatsLeft || 0), 0);
  }

  getLowestPrice(): number {
    if (this.buses.length === 0) return 0;
    return Math.min(...this.buses.map(bus => bus.price));
  }

  getHighestPrice(): number {
    if (this.buses.length === 0) return 0;
    return Math.max(...this.buses.map(bus => bus.price));
  }

  onSearch(): void {
    if (this.searchForm.valid) {
      this.loading = true;
      this.error = null;
      this.searched = true;
      this.suggestedDate = null;

      this.busService.searchBuses(this.searchForm.value).subscribe({
        next: (buses) => {
          this.originalBuses = buses;
          this.recomputeSpecialOfferThreshold();
          this.applyFiltersAndSorting();
          this.loading = false;

          if (this.originalBuses.length === 0) {
            const v = this.searchForm.value;
            this.busService.getFirstAvailableDate(v.from, v.to, v.journeyDate).subscribe({
              next: (res) => {
                this.suggestedDate = res?.date ?? null;
              },
              error: () => {
                this.suggestedDate = null;
              }
            });
          }
        },
        error: (err) => {
          this.error = 'Failed to search buses. Please try again.';
          this.loading = false;
          console.error('Error searching buses:', err);
        }
      });
    }
  }

  viewSeatPlan(busScheduleId: string): void {
     this.router.navigate(['/bus', busScheduleId, 'confirm']);
  }

  resetSearch(): void {
    this.searchForm.reset();
    this.buses = [];
    this.searched = false;
    this.error = null;
  }

  // Generate city code from full city name (e.g., "Dhaka" -> "DHA", "Chittagong" -> "CHA")
  getCityCode(cityName: string): string {
    if (!cityName || cityName.length < 3) return cityName.toUpperCase();
    
    // Take first 3 letters and uppercase
    return cityName.substring(0, 3).toUpperCase();
  }

  // Get route code (e.g., "DHA-CHA")
  getRouteCode(from: string, to: string): string {
    return `${this.getCityCode(from)}-${this.getCityCode(to)}`;
  }

  // Placeholder: Returns AC by default (can be made dynamic when backend provides this info)
  isAC(bus: AvailableBusDto): boolean {
    // TODO: Add hasAC field to AvailableBusDto when backend supports it
    return true; // Default to AC for now
  }

  openCancellationModal(): void {
    this.showCancellationModal = true;
  }

  closeCancellationModal(): void {
    this.showCancellationModal = false;
  }

  // Format time string (HH:mm) to 12-hour format with AM/PM
  formatTimeToAMPM(timeString: string): string {
    if (!timeString) return '';
    
    // Parse time string (assuming format like "14:30" or "09:15")
    const [hours, minutes] = timeString.split(':').map(Number);
    
    if (isNaN(hours) || isNaN(minutes)) return timeString;
    
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12; // Convert 0 to 12 for midnight
    
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
  }

  // Toggle filter panel visibility
  toggleFilterPanel(): void {
    this.showFilterPanel = !this.showFilterPanel;
  }

  // Toggle a departure time window in filters
  toggleTimeWindow(window: DepartureTimeWindow): void {
    const arr = new Set(this.filters.timeWindows ?? []);
    if (arr.has(window)) arr.delete(window); else arr.add(window);
    this.filters.timeWindows = Array.from(arr);
    this.applyFiltersAndSorting();
  }

  // Update min seats filter
  updateMinSeats(value: number | null): void {
    const v = value ?? undefined;
    this.filters.minSeats = v && v > 0 ? v : undefined;
    this.applyFiltersAndSorting();
  }

  // Toggle special offers only
  toggleSpecialOffers(): void {
    this.filters.specialOffersOnly = !this.filters.specialOffersOnly;
    this.applyFiltersAndSorting();
  }

  // Reset filters
  resetFilters(): void {
    this.filters = {
      sortBy: this.sortBy,
      minSeats: undefined,
      timeWindows: [],
      specialOffersOnly: false
    };
    this.applyFiltersAndSorting();
  }

  // Apply filters and then sorting to originalBuses
  private applyFiltersAndSorting(): void {
    // Start with original list
    let filtered = [...this.originalBuses];

    // Filter by min seats
    if (this.filters.minSeats && this.filters.minSeats > 0) {
      filtered = filtered.filter(b => (b.seatsLeft ?? 0) >= (this.filters.minSeats as number));
    }

    // Filter by departure time windows
    if (this.filters.timeWindows && this.filters.timeWindows.length > 0) {
      filtered = filtered.filter(b => this.isWithinSelectedWindows(b.startTime, this.filters.timeWindows as DepartureTimeWindow[]));
    }

    // Filter by special offers only
    if (this.filters.specialOffersOnly) {
      filtered = filtered.filter(b => this.isSpecialOffer(b));
    }

    this.buses = filtered;
    // Apply sorting
    this.sortBuses(this.filters.sortBy);
  }

  private isWithinSelectedWindows(timeString: string, windows: DepartureTimeWindow[]): boolean {
    const minutes = this.timeStringToMinutes(timeString);
    // Define windows: morning 06:00-11:59, afternoon 12:00-16:59, evening 17:00-20:59, night 21:00-05:59
    const inMorning = minutes >= 6 * 60 && minutes < 12 * 60;
    const inAfternoon = minutes >= 12 * 60 && minutes < 17 * 60;
    const inEvening = minutes >= 17 * 60 && minutes < 21 * 60;
    const inNight = minutes >= 21 * 60 || minutes < 6 * 60; // wrap-around

    for (const w of windows) {
      if (
        (w === 'morning' && inMorning) ||
        (w === 'afternoon' && inAfternoon) ||
        (w === 'evening' && inEvening) ||
        (w === 'night' && inNight)
      ) {
        return true;
      }
    }
    return false;
  }

  private timeStringToMinutes(timeString: string): number {
    const [h, m] = timeString.split(':').map(Number);
    if (isNaN(h) || isNaN(m)) return 0;
    return h * 60 + m;
  }

  private recomputeSpecialOfferThreshold(): void {
    if (!this.originalBuses || this.originalBuses.length === 0) {
      this.specialOfferPriceThreshold = null;
      return;
    }
    const prices = this.originalBuses.map(b => b.price).sort((a, b) => a - b);
    const idx = Math.floor(0.25 * (prices.length - 1));
    this.specialOfferPriceThreshold = prices[idx] ?? null;
  }

  isSpecialOffer(bus: AvailableBusDto): boolean {
    if (this.specialOfferPriceThreshold == null) return false;
    return bus.price <= (this.specialOfferPriceThreshold as number);
  }

  // Format JS Date to yyyy-MM-dd for <input type="date">
  private formatForDateInput(d: Date): string {
    const year = d.getFullYear();
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // Accept suggestion and search again
  applySuggestedDate(): void {
    if (!this.suggestedDate) return;
    this.searchForm.patchValue({ journeyDate: this.suggestedDate });
    this.onSearch();
  }
}
