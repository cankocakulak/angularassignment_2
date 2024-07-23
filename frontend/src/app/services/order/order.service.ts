import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, retryWhen, delay, concatMap } from 'rxjs/operators';
import { OrderItem } from '../../models/order.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = `${environment.apiUrl}/order`;

  constructor(private http: HttpClient) { }

  getOrder(): Observable<{ order: OrderItem[] }> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${environment.apiKey}`);
    return this.http.get<{ order: OrderItem[] }>(this.apiUrl, { headers }).pipe(
      retryWhen(errors =>
        errors.pipe(
          concatMap((e, i) => i < 5 ? of(e).pipe(delay(1000)) : throwError(e))
        )
      ),
      catchError(error => {
        console.error('Error fetching order data', error);
        return of({ order: [] as OrderItem[] });
      })
    );
  }
}

