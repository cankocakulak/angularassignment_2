import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Shipping } from '../models/order.model';
import { ShippingService } from '../services/shipping/shipping.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-shipping-details',
  templateUrl: './shipping-details.component.html',
  styleUrls: ['./shipping-details.component.scss']
})
export class ShippingDetailsComponent /* implements OnInit, OnDestroy */ {
  private _shipping: Shipping | undefined;
  private destroy$ = new Subject<void>();

  @Input()
  set shipping(value: Shipping | undefined) {
    this._shipping = value;
  }

  get shipping(): Shipping | undefined {
    return this._shipping;
  }
/* In case of need to implement OnInit and OnDestroy
  constructor(private shippingService: ShippingService) {}

  ngOnInit(): void {
    // Uncomment the method you want to use
   // this.loadShippingDetailsRxJS(0); // replace 0 with the actual totalWeight
     this.loadShippingDetailsPromise(0); // replace 0 with the actual totalWeight
  }

  loadShippingDetailsRxJS(totalWeight: number): void {
    this.shippingService.getShipping(totalWeight).pipe(
      takeUntil(this.destroy$)
    ).subscribe(
      response => {
        this.shipping = response.shipping;
      },
      error => {
        console.error('Error loading shipping details', error);
      }
    );
  }

  async loadShippingDetailsPromise(totalWeight: number): Promise<void> {
    try {
      const response = await this.shippingService.getShippingPromise(totalWeight);
      this.shipping = response.shipping;
    } catch (error) {
      console.error('Error loading shipping details', error);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  */
}
