import { Injectable } from '@angular/core';
import { Observable, forkJoin, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
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
          }))
        );
      })
    );
  }

  // Promise approach
  async getSummaryPromise(): Promise<OrderSummary> {
    const orderResponse = await this.orderService.getOrderPromise();
    const taxResponse = await this.taxService.getTaxPromise();
    const totalWeight = orderResponse.order.reduce((sum, item) => sum + item.weight * item.qty, 0);
    const shippingResponse = await this.shippingService.getShippingPromise(totalWeight);

    return {
      order: orderResponse.order,
      shipping: shippingResponse.shipping,
      tax: taxResponse.tax
    };
  }

  
}
