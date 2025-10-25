export interface BookSeatInputDto {
  busScheduleId: string;
  passengerName: string;
  passengerPhone: string;
  seatNumbers: number[];
}

export interface BookSeatResultDto {
  busScheduleId: string;
  ticketIds: string[];
  seatNumbers: number[];
  totalPrice: number;
}
