import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { OrderSummaryService } from '../services/order-summary/order-summary.service';
import { OrderSummary } from '../models/order.model';

@Component({
  selector: 'app-order-summary',
  templateUrl: './order-summary.component.html',
  styleUrls: ['./order-summary.component.scss']
})
export class OrderSummaryComponent  implements OnInit, OnDestroy {
  orderSummary: OrderSummary | null = null;
  orderTotalAmount: number = 0;
  orderTotal: number = 0;
  private destroy$ = new Subject<void>();

  constructor(private orderSummaryService: OrderSummaryService) {}

  ngOnInit(): void {
    // Uncomment the method you want to use
     this.loadOrderSummaryRxJS();
    // this.loadOrderSummaryPromise();
  }

  // RxJS approach
  loadOrderSummaryRxJS(): void {
    this.orderSummaryService.getSummary().pipe(
      takeUntil(this.destroy$)
    ).subscribe(
      summary => {
        this.orderSummary = summary;
        this.calculateOrderTotal();
      },
      error => {
        console.error('Error loading order summary', error);
      }
    );
  }

  // Promise approach
  async loadOrderSummaryPromise(): Promise<void> {
    try {
      const summary = await this.orderSummaryService.getSummaryPromise();
      this.orderSummary = summary;
      this.calculateOrderTotal();
    } catch (error) {
      console.error('Error loading order summary', error);
    }
  }

  calculateOrderTotal(): void {
    if (this.orderSummary) {
      this.orderTotalAmount = this.orderSummary.order.reduce((sum, item) => sum + item.price * item.qty, 0);
      const shippingCost = this.orderSummary.shipping.cost;
      const taxAmount = this.orderTotalAmount * this.orderSummary.tax.amount;
      this.orderTotal = this.orderTotalAmount + shippingCost + taxAmount;
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
