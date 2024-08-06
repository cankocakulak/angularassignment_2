import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Tax } from '../../models/order.model';
import { environment } from '../../../environments/environment';
import { lastValueFrom } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class TaxService {
  private apiUrl = `${environment.apiUrl}/tax`;

  constructor(private http: HttpClient) { }

  // RxJS-based method without retry and error handling
  getTax(): Observable<{ tax: Tax }> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${environment.apiKey}`);
    return this.http.get<{ tax: Tax }>(this.apiUrl, { headers });
  }

  // Promise-based method with retry logic
  getTaxPromise(): Promise<{ tax: Tax }> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${environment.apiKey}`);
    return lastValueFrom(this.http.get<{ tax: Tax }>(this.apiUrl, { headers }));
  }
}
