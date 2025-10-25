import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AvailableBusDto, BusSearchParams } from '../models/bus.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BusService {
  private apiUrl = `${environment.apiUrl}/api/search`;

  constructor(private http: HttpClient) {}

  /**
   * Search for available buses based on origin, destination, and date
   */
  searchBuses(searchParams: BusSearchParams): Observable<AvailableBusDto[]> {
    let params = new HttpParams()
      .set('origin', searchParams.origin)
      .set('destination', searchParams.destination)
      .set('departureDate', searchParams.departureDate);

    return this.http.get<AvailableBusDto[]>(this.apiUrl, { params });
  }

  /**
   * Get bus details by ID
   */
  getBusById(busId: number): Observable<AvailableBusDto> {
    return this.http.get<AvailableBusDto>(`${this.apiUrl}/${busId}`);
  }
}
