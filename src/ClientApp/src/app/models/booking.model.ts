export interface BookSeatInputDto {
  busScheduleId: string;
  passengerName: string;
  passengerPhone: string;
  seatNumbers: number[];
  boardingPointId?: string;
  droppingPointId?: string;
}

export interface BookSeatResultDto {
  busScheduleId: string;
  ticketIds: string[];
  seatNumbers: number[];
  totalPrice: number;
}
