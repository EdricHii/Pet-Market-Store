import { Component, inject, OnInit } from '@angular/core';
import { OrderStore } from '../stores/order.store';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { pipe, switchMap } from 'rxjs';
import { rxMethod } from '@ngrx/signals/rxjs-interop';


@Component({
  selector: 'app-orders',
  imports: [CommonModule, RouterLink],
  templateUrl: './orders.html',
  styleUrl: './orders.scss',
})
export class Orders implements OnInit {
  orderStore = inject(OrderStore);
  getOrders = rxMethod<void>(
    pipe(
      switchMap(() => this.orderStore.getUserOrders())
    )
  );

  ngOnInit() {
    this.getOrders();
  }
}
