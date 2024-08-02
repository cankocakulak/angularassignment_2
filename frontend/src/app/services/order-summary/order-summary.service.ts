import { Injectable } from '@angular/core';
import { Observable, forkJoin, of, throwError } from 'rxjs';
import { catchError, map, switchMap, retry, delay, concatMap } from 'rxjs/operators';
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

  // RxJS approach
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
      retry({ count: 5, delay: 1000 }), // Retry up to 5 times with a 1000ms delay between each attempt
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

  // Promise approach
  async getSummaryPromise(): Promise<OrderSummary> {
    try {
      const orderResponse = await this.retryPromise(() => this.orderService.getOrderPromise(), 5, 1000);
      const taxResponse = await this.retryPromise(() => this.taxService.getTaxPromise(), 5, 1000);
      const totalWeight = orderResponse.order.reduce((sum, item) => sum + item.weight * item.qty, 0);
      const shippingResponse = await this.retryPromise(() => this.shippingService.getShippingPromise(totalWeight), 5, 1000);

      return {
        order: orderResponse.order,
        shipping: shippingResponse.shipping,
        tax: taxResponse.tax
      };
    } catch (error) {
      console.error('Error fetching order, tax, or shipping data', error);
      return {
        order: [] as OrderItem[],
        shipping: {} as Shipping,
        tax: {} as Tax
      };
    }
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
