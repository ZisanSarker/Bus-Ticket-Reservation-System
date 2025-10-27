import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AvailableBusDto, BusSearchParams } from '../models/bus.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BusService {
 
  private apiUrl = `${environment.apiUrl}/search`;

  constructor(private http: HttpClient) {}

  searchBuses(searchParams: BusSearchParams): Observable<AvailableBusDto[]> {
    const params = new HttpParams()
      .set('from', searchParams.from)
      .set('to', searchParams.to)
      .set('journeyDate', searchParams.journeyDate);

    return this.http.get<AvailableBusDto[]>(this.apiUrl, { params });
  }

  getCities(): Observable<string[]> {
    const url = `${environment.apiUrl}/routes/cities`;
    return this.http.get<string[]>(url);
  }

  getFirstAvailableDate(from: string, to: string, startDate?: string): Observable<{ date: string }>
  {
    let params = new HttpParams().set('from', from).set('to', to);
    if (startDate) params = params.set('startDate', startDate);
    return this.http.get<{ date: string }>(`${this.apiUrl}/first-available-date`, { params });
  }
}
