import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Design System Showcase Component
 * This component demonstrates all the design system components and their usage.
 * Use this as a reference when building new components.
 */
@Component({
  selector: 'app-design-showcase',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-background-page py-8 px-4">
      <div class="max-w-7xl mx-auto">
        <h1 class="text-4xl font-bold text-text-primary mb-8">Design System Showcase</h1>

        <!-- Color Palette -->
        <section class="card mb-8">
          <h2 class="text-2xl font-bold mb-4">Color Palette</h2>
          
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <div class="h-20 bg-primary rounded-card mb-2"></div>
              <p class="text-sm font-semibold">Primary</p>
              <p class="text-xs text-text-secondary">#E60000</p>
            </div>
            <div>
              <div class="h-20 bg-text-primary rounded-card mb-2"></div>
              <p class="text-sm font-semibold">Text Primary</p>
              <p class="text-xs text-text-secondary">#333333</p>
            </div>
            <div>
              <div class="h-20 bg-text-secondary rounded-card mb-2"></div>
              <p class="text-sm font-semibold">Text Secondary</p>
              <p class="text-xs text-text-secondary">#888888</p>
            </div>
            <div>
              <div class="h-20 bg-accent-success rounded-card mb-2"></div>
              <p class="text-sm font-semibold">Success</p>
              <p class="text-xs text-text-secondary">#28A745</p>
            </div>
          </div>
        </section>

        <!-- Buttons -->
        <section class="card mb-8">
          <h2 class="text-2xl font-bold mb-4">Buttons</h2>
          
          <div class="flex flex-wrap gap-4">
            <button class="btn-primary">PRIMARY BUTTON</button>
            <button class="btn-secondary">SECONDARY BUTTON</button>
            <button class="btn-tertiary">Tertiary Button</button>
            <button class="btn-primary" disabled>DISABLED</button>
          </div>
        </section>

        <!-- Form Elements -->
        <section class="card mb-8">
          <h2 class="text-2xl font-bold mb-4">Form Elements</h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="input-label">LABEL TEXT</label>
              <input type="text" class="input-field" placeholder="Placeholder text">
            </div>
            
            <div>
              <label class="input-label">DROPDOWN</label>
              <select class="dropdown">
                <option>Option 1</option>
                <option>Option 2</option>
                <option>Option 3</option>
              </select>
            </div>
          </div>
        </section>

        <!-- Tags & Badges -->
        <section class="card mb-8">
          <h2 class="text-2xl font-bold mb-4">Tags & Badges</h2>
          
          <div class="flex flex-wrap gap-3">
            <span class="tag-success">NO EXTRA CHARGE</span>
            <span class="tag-muted">Trending Search</span>
            <span class="tag-muted">Dhaka to Cox's Bazar</span>
          </div>
        </section>

        <!-- Price Display -->
        <section class="card mb-8">
          <h2 class="text-2xl font-bold mb-4">Price Display</h2>
          
          <div class="flex gap-8">
            <div>
              <p class="text-sm text-text-secondary mb-2">Large</p>
              <p class="price-display">৳700</p>
            </div>
            <div>
              <p class="text-sm text-text-secondary mb-2">Small</p>
              <p class="price-display-sm">৳450</p>
            </div>
          </div>
        </section>

        <!-- Seat Icons -->
        <section class="card mb-8">
          <h2 class="text-2xl font-bold mb-4">Seat Status Icons</h2>
          
          <div class="space-y-4">
            <div class="flex flex-wrap gap-4">
              <div class="legend-item">
                <div class="seat-icon seat-available">
                  <span class="text-xs">A1</span>
                </div>
                <span class="legend-label">Available</span>
              </div>
              
              <div class="legend-item">
                <div class="seat-icon seat-selected">
                  <span class="text-xs">A2</span>
                </div>
                <span class="legend-label">Selected</span>
              </div>
              
              <div class="legend-item">
                <div class="seat-icon seat-booked-male">
                  <span class="text-xs">A3</span>
                </div>
                <span class="legend-label">Booked (M)</span>
              </div>
              
              <div class="legend-item">
                <div class="seat-icon seat-booked-female">
                  <span class="text-xs">A4</span>
                </div>
                <span class="legend-label">Booked (F)</span>
              </div>
              
              <div class="legend-item">
                <div class="seat-icon seat-blocked">
                  <span class="text-xs">X</span>
                </div>
                <span class="legend-label">Blocked</span>
              </div>
            </div>
          </div>
        </section>

        <!-- Bus Listing Card -->
        <section class="mb-8">
          <h2 class="text-2xl font-bold mb-4">Bus Listing Card</h2>
          
          <div class="listing-card">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <!-- Left: Operator Details -->
              <div>
                <h3 class="operator-name">National Travels</h3>
                <p class="sub-text">99-DHA-CHA</p>
                <p class="sub-text mt-1">NON AC • Sleeper</p>
                <p class="sub-text mt-2">Cancellation Available</p>
              </div>

              <!-- Middle: Schedule -->
              <div class="flex items-center justify-between">
                <div>
                  <p class="time-display">10:30 AM</p>
                  <p class="location-display">Dhaka</p>
                </div>
                <div class="text-center">
                  <p class="text-sm text-primary font-semibold">28 Seats Left</p>
                </div>
                <div class="text-right">
                  <p class="time-display">6:30 PM</p>
                  <p class="location-display">Cox's Bazar</p>
                </div>
              </div>

              <!-- Right: Price & CTA -->
              <div class="flex flex-col items-start md:items-end justify-between">
                <div>
                  <p class="price-display">৳700</p>
                  <span class="tag-success mt-2">NO EXTRA CHARGE</span>
                </div>
                <button class="btn-primary w-full md:w-auto mt-4 md:mt-0">
                  VIEW SEATS
                </button>
              </div>
            </div>
          </div>
        </section>

        <!-- Stats Bar -->
        <section class="card-static mb-8">
          <h2 class="text-2xl font-bold mb-4">Statistics Bar</h2>
          
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div class="stats-item">
              <p class="stats-label">Total Buses</p>
              <p class="stats-value">24</p>
            </div>
            <div class="stats-item">
              <p class="stats-label">Total Operators</p>
              <p class="stats-value">8</p>
            </div>
            <div class="stats-item">
              <p class="stats-label">Lowest Fare</p>
              <p class="stats-value">৳450</p>
            </div>
            <div class="stats-item">
              <p class="stats-label">Highest Fare</p>
              <p class="stats-value">৳950</p>
            </div>
          </div>
        </section>

        <!-- Sort/Filter Bar -->
        <section class="card-static mb-8">
          <h2 class="text-2xl font-bold mb-4">Sort/Filter Bar</h2>
          
          <div class="flex flex-wrap items-center justify-between gap-4">
            <div class="flex flex-wrap gap-4 md:gap-6">
              <button type="button" class="sort-link active">DEPARTURE TIME</button>
              <button type="button" class="sort-link">FARE</button>
              <button type="button" class="sort-link">SEATS LEFT</button>
              <button type="button" class="sort-link">ARRIVAL TIME</button>
            </div>
            <button type="button" class="btn-secondary !py-2">
              FILTER BY
            </button>
          </div>
        </section>

        <!-- Typography -->
        <section class="card mb-8">
          <h2 class="text-2xl font-bold mb-4">Typography</h2>
          
          <div class="space-y-4">
            <div>
              <p class="operator-name">Operator Name Style</p>
            </div>
            <div>
              <p class="time-display">10:30 AM</p>
            </div>
            <div>
              <p class="location-display">Location Display</p>
            </div>
            <div>
              <p class="sub-text">Sub-text style (NON AC)</p>
            </div>
            <div>
              <label class="input-label">INPUT LABEL STYLE</label>
            </div>
          </div>
        </section>

        <!-- Swap Icon -->
        <section class="card mb-8">
          <h2 class="text-2xl font-bold mb-4">Swap Icon</h2>
          
          <div class="swap-icon">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
            </svg>
          </div>
        </section>
      </div>
    </div>
  `,
  styles: []
})
export class DesignShowcaseComponent {}
