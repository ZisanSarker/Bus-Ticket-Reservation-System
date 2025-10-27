export interface SeatPlanDto {
  busScheduleId: string;
  totalSeats: number;
  seats: SeatDto[];
  boardingPoints: RouteStopDto[];
  droppingPoints: RouteStopDto[];
  baseFare: number;
  serviceCharge: number;
}

export interface SeatDto {
  seatId: string;
  seatNumber: number;
  row: number;
  isBooked: boolean;
  isBlocked?: boolean; // For VIP or unavailable seats
  isSold?: boolean; // Already sold/reserved
}

export interface RouteStopDto {
  stopId: string;
  stopName: string;
  time: string;
  sequence: number;
}
