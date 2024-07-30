import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { OrderItem } from '../models/order.model';
import { OrderService } from '../services/order/order.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss']
})
export class OrderDetailsComponent /*implements OnInit, OnDestroy*/ {
  private _orderItems: OrderItem[] = [];
  private destroy$ = new Subject<void>();

  @Input()
  set orderItems(value: OrderItem[] | undefined) {
    this._orderItems = value || [];
  }

  get orderItems(): OrderItem[] {
    return this._orderItems;
  }

/* // In case of need to implement OnInit and OnDestroy

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    // Uncomment the method you want to use
    this.loadOrderDetailsRxJS();
    // this.loadOrderDetailsPromise();
  }

  loadOrderDetailsRxJS(): void {
    this.orderService.getOrder().pipe(
      takeUntil(this.destroy$)
    ).subscribe(
      response => {
        this.orderItems = response.order;
      },
      error => {
        console.error('Error loading order details', error);
      }
    );
  }

  async loadOrderDetailsPromise(): Promise<void> {
    try {
      const response = await this.orderService.getOrderPromise();
      this.orderItems = response.order;
    } catch (error) {
      console.error('Error loading order details', error);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  */
}
