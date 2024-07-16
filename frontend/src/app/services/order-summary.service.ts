import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { OrderItem, Shipping, Tax, OrderSummary } from '../models/order.model';

@Injectable({
  providedIn: 'root'
})
export class OrderSummaryService {
  private orderApiUrl = 'http://localhost:3000/order';
  private shippingApiUrl = 'http://localhost:3000/shipping';
  private taxApiUrl = 'http://localhost:3000/tax';

  constructor(private http: HttpClient) {}

  getSummary(): Observable<OrderSummary> {
    return forkJoin({
      order: this.http.get<{ order: OrderItem[] }>(this.orderApiUrl),
      tax: this.http.get<{ tax: Tax }>(this.taxApiUrl)
    }).pipe(
      switchMap(({ order, tax }) => {
        const totalWeight = order.order.reduce((sum, item) => sum + item.weight * item.qty, 0);
        return this.http.get<{ shipping: Shipping }>(`${this.shippingApiUrl}?weight=${totalWeight}`).pipe(
          map(shipping => ({
            order: order.order,
            shipping: shipping.shipping,
            tax: tax.tax
          })),
          catchError(error => {
            console.error('Error fetching shipping data', error);
            return of({
              order: order.order,
              shipping: {} as Shipping,
              tax: tax.tax
            } as OrderSummary);
          })
        );
      }),
      catchError(error => {
        console.error('Error fetching order or tax data', error);
        return of({
          order: [] as OrderItem[],
          shipping: {} as Shipping,
          tax: {} as Tax
        } as OrderSummary);
      })
    );
  }
}
