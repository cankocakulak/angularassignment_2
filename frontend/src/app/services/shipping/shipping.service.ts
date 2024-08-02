import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, retry, delay, concatMap } from 'rxjs/operators';
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
      retry({ count: 5, delay: 1000 }),
      catchError(error => {
        console.error('Error fetching shipping data', error);
        return of({ shipping: {} as Shipping });
      })
    );
  }

  getShippingPromise(totalWeight: number): Promise<{ shipping: Shipping }> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${environment.apiKey}`);
    return new Promise((resolve, reject) => {
      this.retryPromise(() => this.http.get<{ shipping: Shipping }>(`${this.apiUrl}?weight=${totalWeight}`, { headers }).toPromise(), 5, 1000)
        .then(data => {
          if (data) {
            resolve(data);
          } else {
            resolve({ shipping: {} as Shipping }); // Resolve with empty shipping if data is undefined
          }
        })
        .catch(error => {
          console.error('Error fetching shipping data', error);
          resolve({ shipping: {} as Shipping }); // Resolve with empty shipping on error
        });
    });
  }

  private async retryPromise<T>(fn: () => Promise<T>, retries: number, delayMs: number): Promise<T> {
    let attempt = 0;
    while (attempt < retries) {
      try {
        return await fn();
      } catch (error) {
        if (attempt === retries - 1) throw error;
        attempt++;
        await new Promise(resolve => setTimeout(resolve, delayMs));
      }
    }
    throw new Error('Max retries reached');
  }
}
