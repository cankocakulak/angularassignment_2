// src/app/services/shipping/shipping.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Shipping } from '../../models/order.model';
import { environment } from '../../../environments/environment';
import { lastValueFrom } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ShippingService {
  private apiUrl = `${environment.apiUrl}/shipping`;

  constructor(private http: HttpClient) { }

  // RxJS-based method without retry and error handling
  getShipping(totalWeight: number): Observable<{ shipping: Shipping }> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${environment.apiKey}`);
    return this.http.get<{ shipping: Shipping }>(`${this.apiUrl}?weight=${totalWeight}`, { headers });
  }

  // Promise-based method with retry logic
  getShippingPromise(totalWeight: number): Promise<{ shipping: Shipping }> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${environment.apiKey}`);
    return lastValueFrom(this.http.get<{ shipping: Shipping }>(`${this.apiUrl}?weight=${totalWeight}`, { headers }));
  }
}
