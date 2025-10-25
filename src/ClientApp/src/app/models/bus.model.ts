export interface AvailableBusDto {
  id: number;
  busNumber: string;
  busName: string;
  departureTime: string;
  arrivalTime: string;
  origin: string;
  destination: string;
  availableSeats: number;
  totalSeats: number;
  pricePerSeat: number;
}

export interface BusSearchParams {
  origin: string;
  destination: string;
  departureDate: string;
}
