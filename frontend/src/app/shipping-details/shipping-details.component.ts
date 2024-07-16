import { Component, Input } from '@angular/core';
import { Shipping } from '../models/order.model';

@Component({
  selector: 'app-shipping-details',
  templateUrl: './shipping-details.component.html',
  styleUrls: ['./shipping-details.component.scss']
})
export class ShippingDetailsComponent {
  private _shipping: Shipping | undefined;

  @Input()
  set shipping(value: Shipping | undefined) {
    this._shipping = value;
  }

  get shipping(): Shipping | undefined {
    return this._shipping;
  }
}
