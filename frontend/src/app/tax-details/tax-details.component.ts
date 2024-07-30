import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Tax } from '../models/order.model';
import { TaxService } from '../services/tax/tax.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-tax-details',
  templateUrl: './tax-details.component.html',
  styleUrls: ['./tax-details.component.scss']
})
export class TaxDetailsComponent /* implements OnInit, OnDestroy */ {
  private _tax: Tax | undefined;
  private destroy$ = new Subject<void>();

  @Input()
  set tax(value: Tax | undefined) {
    this._tax = value;
  }

  get tax(): Tax | undefined {
    return this._tax;
  }

  /*  In case of need to implement OnInit and OnDestroy
  constructor(private taxService: TaxService) {}

  ngOnInit(): void {
    // Uncomment the method you want to use
    this.loadTaxDetailsRxJS();
    // this.loadTaxDetailsPromise();
  }

  loadTaxDetailsRxJS(): void {
    this.taxService.getTax().pipe(
      takeUntil(this.destroy$)
    ).subscribe(
      response => {
        this.tax = response.tax;
      },
      error => {
        console.error('Error loading tax details', error);
      }
    );
  }

  async loadTaxDetailsPromise(): Promise<void> {
    try {
      const response = await this.taxService.getTaxPromise();
      this.tax = response.tax;
    } catch (error) {
      console.error('Error loading tax details', error);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  */
}
