import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { OrderSummaryComponent } from './order-summary/order-summary.component';
import { OrderDetailsComponent } from './order-details/order-details.component';
import { ShippingDetailsComponent } from './shipping-details/shipping-details.component';
import { TaxDetailsComponent } from './tax-details/tax-details.component';

@NgModule({
  declarations: [
    AppComponent,
    OrderSummaryComponent,
    OrderDetailsComponent,
    ShippingDetailsComponent,
    TaxDetailsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
