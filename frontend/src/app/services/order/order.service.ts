// src/app/services/order/order.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OrderItem } from '../../models/order.model';
import { environment } from '../../../environments/environment';
import { lastValueFrom } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = `${environment.apiUrl}/order`;

  constructor(private http: HttpClient) { }

  // RxJS-based method without retry and error handling
  getOrder(): Observable<{ order: OrderItem[] }> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${environment.apiKey}`);
    return this.http.get<{ order: OrderItem[] }>(this.apiUrl, { headers });
  }

  // Promise-based method with retry logic
  getOrderPromise(): Promise<{ order: OrderItem[] }> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${environment.apiKey}`);
    return lastValueFrom(this.http.get<{ order: OrderItem[] }>(this.apiUrl, { headers }));
  }
}
