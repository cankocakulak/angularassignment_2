import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, retryWhen, delay, concatMap } from 'rxjs/operators';
import { Shipping } from '../../models/order.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ShippingService {
  private apiUrl = `${environment.apiUrl}/shipping`;

  constructor(private http: HttpClient) { }

  getShipping(totalWeight: number): Observable<{ shipping: Shipping }> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${environment.apiKey}`);
    return this.http.get<{ shipping: Shipping }>(`${this.apiUrl}?weight=${totalWeight}`, { headers }).pipe(
      retryWhen(errors =>
        errors.pipe(
          concatMap((e, i) => i < 5 ? of(e).pipe(delay(1000)) : throwError(e))
        )
      ),
      catchError(error => {
        console.error('Error fetching shipping data', error);
        return of({ shipping: {} as Shipping });
      })
    );
  }
}
