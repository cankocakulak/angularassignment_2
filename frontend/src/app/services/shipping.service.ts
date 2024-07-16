import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Shipping } from '../models/order.model';

@Injectable({
  providedIn: 'root'
})
export class ShippingService {
  private apiUrl = 'http://localhost:3000/shipping';

  constructor(private http: HttpClient) { }

  getShipping(totalWeight: number): Observable<{ shipping: Shipping }> {
    return this.http.get<{ shipping: Shipping }>(`${this.apiUrl}?weight=${totalWeight}`);
  }
}
