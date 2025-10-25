export interface BookSeatInputDto {
  busScheduleId: number;
  seatIds: number[];
  passengerName: string;
  passengerEmail: string;
  passengerPhone: string;
}

export interface BookSeatResultDto {
  ticketId: number;
  busScheduleId: number;
  passengerName: string;
  seatNumbers: string[];
  totalAmount: number;
  bookingDate: string;
  status: string;
}
