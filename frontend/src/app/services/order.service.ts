import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OrderItem } from '../models/order.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = 'http://localhost:3000/order';

  constructor(private http: HttpClient) { }

  getOrder(): Observable<{ order: OrderItem[] }> {
    return this.http.get<{ order: OrderItem[] }>(this.apiUrl);
  }
}
