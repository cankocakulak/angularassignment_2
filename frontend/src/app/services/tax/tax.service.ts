import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, retryWhen, delay, concatMap } from 'rxjs/operators';
import { Tax } from '../../models/order.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TaxService {
  private apiUrl = `${environment.apiUrl}/tax`;

  constructor(private http: HttpClient) { }

  getTax(): Observable<{ tax: Tax }> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${environment.apiKey}`);
    return this.http.get<{ tax: Tax }>(this.apiUrl, { headers }).pipe(
      retryWhen(errors =>
        errors.pipe(
          concatMap((e, i) => i < 5 ? of(e).pipe(delay(1000)) : throwError(e))
        )
      ),
      catchError(error => {
        console.error('Error fetching tax data', error);
        return of({ tax: {} as Tax });
      })
    );
  }

  getTaxPromise(): Promise<{ tax: Tax }> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${environment.apiKey}`);
    return new Promise((resolve, reject) => {
      this.retryPromise(() => this.http.get<{ tax: Tax }>(this.apiUrl, { headers }).toPromise(), 5, 1000)
        .then(data => {
          if (data) {
            resolve(data);
          } else {
            resolve({ tax: {} as Tax }); // Resolve with empty tax if data is undefined
          }
        })
        .catch(error => {
          console.error('Error fetching tax data', error);
          resolve({ tax: {} as Tax }); // Resolve with empty tax on error
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
