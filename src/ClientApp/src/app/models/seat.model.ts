export interface SeatPlanDto {
  busScheduleId: number;
  busNumber: string;
  totalSeats: number;
  availableSeats: number;
  seats: SeatDto[];
}

export interface SeatDto {
  id: number;
  seatNumber: string;
  isAvailable: boolean;
  position: {
    row: number;
    column: number;
  };
}
