import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AvailableBusDto, BusSearchParams } from '../models/bus.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BusService {
  // environment.apiUrl already includes '/api' base
  private apiUrl = `${environment.apiUrl}/search`;

  constructor(private http: HttpClient) {}

  /**
   * Search for available buses based on from, to, and journeyDate
   */
  searchBuses(searchParams: BusSearchParams): Observable<AvailableBusDto[]> {
    const params = new HttpParams()
      .set('from', searchParams.from)
      .set('to', searchParams.to)
      .set('journeyDate', searchParams.journeyDate);

    return this.http.get<AvailableBusDto[]>(this.apiUrl, { params });
  }
}
