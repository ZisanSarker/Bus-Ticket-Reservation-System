export interface AvailableBusDto {
  busScheduleId: string;
  busId: string;
  busName: string;
  companyName: string;
  from: string;
  to: string;
  startingCounter: string;
  arrivalCounter: string;
  journeyDate: string;
  startTime: string;
  arrivalTime: string;
  price: number;
  totalSeats: number;
  seatsLeft: number;
  durationMinutes: number;
}

export interface BusSearchParams {
  from: string;
  to: string;
  journeyDate: string;
}

// Sorting options for bus list
export type BusSortBy = 'departure' | 'arrival' | 'fare' | 'seats';

// Time windows for filtering departures
export type DepartureTimeWindow = 'morning' | 'afternoon' | 'evening' | 'night';

// Client-side filter options for bus results
export interface BusFilterOptions {
  // Which sort to apply on the filtered results
  sortBy: BusSortBy;
  // Optional minimum seats constraint
  minSeats?: number;
  // One or more departure time windows to include; if empty or undefined, include all
  timeWindows?: DepartureTimeWindow[];
  // If true, show only special offer buses (lowest priced quartile in current result set)
  specialOffersOnly?: boolean;
}
