import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BusService } from '../../services/bus.service';
import { AvailableBusDto } from '../../models/bus.model';

@Component({
  selector: 'app-search-buses',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './search-buses.component.html',
  styleUrl: './search-buses.component.css'
})
export class SearchBusesComponent implements OnInit {
  searchForm!: FormGroup;
  buses: AvailableBusDto[] = [];
  loading = false;
  error: string | null = null;
  searched = false;

  constructor(
    private fb: FormBuilder,
    private busService: BusService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {
    this.searchForm = this.fb.group({
      from: ['', Validators.required],
      to: ['', Validators.required],
      journeyDate: ['', Validators.required]
    });
  }

  onSearch(): void {
    if (this.searchForm.valid) {
      this.loading = true;
      this.error = null;
      this.searched = true;

      this.busService.searchBuses(this.searchForm.value).subscribe({
        next: (buses) => {
          this.buses = buses;
          this.loading = false;
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
    this.router.navigate(['/bus', busScheduleId, 'seatplan']);
  }

  resetSearch(): void {
    this.searchForm.reset();
    this.buses = [];
    this.searched = false;
    this.error = null;
  }
}
