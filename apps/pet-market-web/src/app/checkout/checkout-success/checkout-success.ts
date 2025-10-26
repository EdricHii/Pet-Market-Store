import { CommonModule } from '@angular/common';
import { afterNextRender, Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { OrderStore } from '../../stores/order.store';
import { CartStore } from '../../stores/cart.store';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { map, pipe, switchMap } from 'rxjs';
import { OrderStatus } from '../../types/order.types';
import { OrderDetail } from '../../components/order-detail/order-detail';

@Component({
  selector: 'app-checkout-success',
  imports: [CommonModule, RouterLink, OrderDetail],
  templateUrl: './checkout-success.html',
  styleUrl: './checkout-success.scss',
})
export class CheckoutSuccess implements OnInit {
  orderStore = inject(OrderStore);
  route = inject(ActivatedRoute);
  cartStore = inject(CartStore);
  getAndUpdateOrder = rxMethod<string>(
    pipe(
      switchMap((orderId) => {
        return this.orderStore.getOrder(orderId)
      }),
      map((order) => {
        if (order.status === OrderStatus.PAYMENT_REQUIRED) {
          return this.orderStore.updateOrder({
            id: order.id,
            status: OrderStatus.PENDING,
          });
        }
        return null;
      })
    )
  );

  constructor() {
    afterNextRender(() => {
      this.cartStore.clearCart();
    })
  }

  ngOnInit() {
    const orderId = this.route.snapshot.queryParamMap.get('orderid');
    if (!orderId) {
      this.orderStore.setError('No order ID found');
      return;
    }
    this.getAndUpdateOrder(orderId);
  }
}
