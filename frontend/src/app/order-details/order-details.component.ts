import { Component, Input } from '@angular/core';
import { OrderItem } from '../models/order.model';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss']
})
export class OrderDetailsComponent {
  private _orderItems: OrderItem[] = [];

  @Input()
  set orderItems(value: OrderItem[] | undefined) {
    this._orderItems = value || [];
  }

  get orderItems(): OrderItem[] {
    return this._orderItems;
  }
}
