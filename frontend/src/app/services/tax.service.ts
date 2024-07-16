import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Tax } from '../models/order.model';

@Injectable({
  providedIn: 'root'
})
export class TaxService {
  private apiUrl = 'http://localhost:3000/tax';

  constructor(private http: HttpClient) { }

  getTax(): Observable<{ tax: Tax }> {
    return this.http.get<{ tax: Tax }>(this.apiUrl);
  }
}
