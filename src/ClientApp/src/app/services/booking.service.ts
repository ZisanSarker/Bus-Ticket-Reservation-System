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
 
  private apiUrl = `${environment.apiUrl}/booking`;

  constructor(private http: HttpClient) {}

  getSeatPlan(busScheduleId: string): Observable<SeatPlanDto> {
    return this.http.get<SeatPlanDto>(`${this.apiUrl}/seatplan/${busScheduleId}`);
  }

  bookSeats(bookingData: BookSeatInputDto): Observable<BookSeatResultDto> {
    return this.http.post<BookSeatResultDto>(`${this.apiUrl}/book`, bookingData);
  }

  getBookingDetails(ticketId: string): Observable<BookSeatResultDto> {
    return this.http.get<BookSeatResultDto>(`${this.apiUrl}/${ticketId}`);
  }
}
