import { Component, Input } from '@angular/core';
import { Tax } from '../models/order.model';

@Component({
  selector: 'app-tax-details',
  templateUrl: './tax-details.component.html',
  styleUrls: ['./tax-details.component.scss']
})
export class TaxDetailsComponent {
  private _tax: Tax | undefined;

  @Input()
  set tax(value: Tax | undefined) {
    this._tax = value;
  }

  get tax(): Tax | undefined {
    return this._tax;
  }
}
