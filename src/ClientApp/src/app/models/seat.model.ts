export interface SeatPlanDto {
  busScheduleId: string;
  totalSeats: number;
  seats: SeatDto[];
}

export interface SeatDto {
  seatId: string;
  seatNumber: number;
  row: number;
  isBooked: boolean;
}
