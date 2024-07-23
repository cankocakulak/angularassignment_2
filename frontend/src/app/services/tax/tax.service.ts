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
}
