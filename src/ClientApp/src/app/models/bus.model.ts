export interface AvailableBusDto {
  busScheduleId: string; // GUID
  busId: string; // GUID
  busName: string;
  companyName: string;
  from: string;
  to: string;
  journeyDate: string; // ISO date (yyyy-MM-dd)
  startTime: string; // e.g., HH:mm:ss
  arrivalTime: string; // e.g., HH:mm:ss
  price: number;
  totalSeats: number;
  seatsLeft: number;
  durationMinutes: number;
}

export interface BusSearchParams {
  from: string;
  to: string;
  journeyDate: string; // yyyy-MM-dd
}
