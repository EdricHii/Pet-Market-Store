import { Injectable } from '@nestjs/common';
import { CreateCheckoutDto } from './dto/create-checkout.dto';
import { OrdersService } from '../orders/orders.service';
import { Stripe } from 'stripe'
import { FirebaseService } from '../firebase/firebase.service';

const stripeSecret = process.env.STRIPE_SECRET;

if (!stripeSecret) {
  throw new Error('Missing stripe secret');
}

const stripe = new Stripe(stripeSecret);


@Injectable()
export class CheckoutService {
  constructor(private orderService: OrdersService, private firebaseService: FirebaseService) { }
  async create(createCheckoutDto: CreateCheckoutDto, token: string) {
    let userId: string | undefined;
    if (token) {
      userId = await this.firebaseService.verifyToken(token);
    }
    const order = await this.orderService.create({
      items: createCheckoutDto.items,
      totalAmount: createCheckoutDto.totalAmount,
      userId
    });


    const session = await stripe.checkout.sessions.create({
      line_items: createCheckoutDto.items.map(item => ({
        price_data: {
          currency: 'myr',
          product_data: {
            name: item.name
          },
          unit_amount: Math.round(item.price * 100)
        },
        quantity: item.quantity
      })),
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/checkout/success?orderid=${order.id}`,
      cancel_url: `${process.env.FRONTEND_URL}/checkout/cancel?orderid=${order.id}`,
      metadata: {
        orderId: order.id
      }
    });
    return {
      url: session.url,
      sessionId: session.id,
      orderId: order.id
    };
  }
}
