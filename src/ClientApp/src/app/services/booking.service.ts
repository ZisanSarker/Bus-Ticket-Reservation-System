import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SeatPlanDto } from '../models/seat.model';
import { BookSeatInputDto, BookSeatResultDto } from '../models/booking.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private apiUrl = `${environment.apiUrl}/api/booking`;

  constructor(private http: HttpClient) {}

  /**
   * Get seat plan for a specific bus schedule
   */
  getSeatPlan(busScheduleId: number): Observable<SeatPlanDto> {
    return this.http.get<SeatPlanDto>(`${this.apiUrl}/seatplan/${busScheduleId}`);
  }

  /**
   * Book seats for a passenger
   */
  bookSeats(bookingData: BookSeatInputDto): Observable<BookSeatResultDto> {
    return this.http.post<BookSeatResultDto>(`${this.apiUrl}/book`, bookingData);
  }

  /**
   * Get booking details by ticket ID
   */
  getBookingDetails(ticketId: number): Observable<BookSeatResultDto> {
    return this.http.get<BookSeatResultDto>(`${this.apiUrl}/${ticketId}`);
  }
}
