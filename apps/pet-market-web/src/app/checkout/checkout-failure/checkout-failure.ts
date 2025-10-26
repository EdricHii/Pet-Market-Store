import { CommonModule, isPlatformServer } from '@angular/common';
import { Component, inject, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { OrderStore } from '../../stores/order.store';

@Component({
  selector: 'app-checkout-failure',
  imports: [CommonModule, RouterLink],
  templateUrl: './checkout-failure.html',
  styleUrl: './checkout-failure.scss',
})
export class CheckoutFailure {
  orderStore = inject(OrderStore);
  route = inject(ActivatedRoute);
  platformId = inject(PLATFORM_ID)

  ngOnInit() {
    if (isPlatformServer(this.platformId)) {
      return;
    }
    const orderId = this.route.snapshot.queryParamMap.get('orderid');
    if (!orderId) {
      this.orderStore.setError('No order ID found');
      return;
    }
    this.orderStore.removeUnPaidOrder(orderId)
  }
}
