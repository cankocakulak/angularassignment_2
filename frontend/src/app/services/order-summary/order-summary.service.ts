import { Injectable } from '@angular/core';
import { Observable, forkJoin, of, throwError } from 'rxjs';
import { catchError, map, switchMap, retryWhen, delay, concatMap } from 'rxjs/operators';
import { OrderItem, Shipping, Tax, OrderSummary } from '../../models/order.model';
import { OrderService } from '../order/order.service';
import { ShippingService } from '../shipping/shipping.service';
import { TaxService } from '../tax/tax.service';

@Injectable({
  providedIn: 'root'
})
export class OrderSummaryService {
  constructor(
    private orderService: OrderService,
    private shippingService: ShippingService,
    private taxService: TaxService
  ) {}

  getSummary(): Observable<OrderSummary> {
    return forkJoin({
      order: this.orderService.getOrder(),
      tax: this.taxService.getTax()
    }).pipe(
      switchMap(({ order, tax }) => {
        const totalWeight = order.order.reduce((sum, item) => sum + item.weight * item.qty, 0);
        return this.shippingService.getShipping(totalWeight).pipe(
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
      retryWhen(errors =>
        errors.pipe(
          concatMap((e, i) => i < 5 ? of(e).pipe(delay(1000)) : throwError(e))
        )
      ),
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
