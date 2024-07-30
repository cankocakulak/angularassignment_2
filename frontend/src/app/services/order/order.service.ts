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

  getOrderPromise(): Promise<{ order: OrderItem[] }> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${environment.apiKey}`);
    return new Promise((resolve, reject) => {
      this.retryPromise(() => this.http.get<{ order: OrderItem[] }>(this.apiUrl, { headers }).toPromise(), 5, 1000)
        .then(data => {
          if (data) {
            resolve(data);
          } else {
            resolve({ order: [] as OrderItem[] }); // Resolve with empty order if data is undefined
          }
        })
        .catch(error => {
          console.error('Error fetching order data', error);
          resolve({ order: [] as OrderItem[] }); // Resolve with empty order on error
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
