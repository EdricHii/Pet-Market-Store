import { computed } from '@angular/core';
import { patchState, signalStore, withMethods, withState, withComputed } from '@ngrx/signals';
import { Product } from '@prisma/client';

type CartItem = Product & {
    quantity: number;
};

type CartState = {
    items: CartItem[];
};

const initialState: CartState = {
    items: []
};

const CART_LOCALSTORAGE_KEY = 'pet_market_cart';

export const CartStore = signalStore(
    { providedIn: 'root' },
    withState(() => {
        if ('localStorage' in globalThis) {
            return {
                ...initialState,
                items: JSON.parse(localStorage.getItem(CART_LOCALSTORAGE_KEY) ?? '[]') as CartItem[],
            };
        }
        return initialState;
    }),
    withComputed((store) => ({
        totalItems: computed(() =>
            store.items().reduce((acc, item) => {
                return acc + item.quantity
            }, 0)
        ),
        totalAmount: computed(() =>
            store.items().reduce((acc, item) => {
                return acc + item.quantity * item.price;
            }, 0)
        ),
    })),
    withMethods((store) => ({
        addToCart(product: Product, quantity = 1) {
            const currentItems = store.items();
            const existingItemIndex = currentItems.findIndex(
                (cartItem) => cartItem.id === product.id
            );

            if (existingItemIndex !== -1) {
                const updatedItems = currentItems.map((cartItem, idx) => {
                    if (idx === existingItemIndex) {
                        return {
                            ...cartItem,
                            quantity: cartItem.quantity + quantity,
                        };
                    }
                    return cartItem;
                });
                patchState(store, { items: updatedItems });
            } else {
                patchState(store, {
                    items: [
                        ...currentItems,
                        {
                            ...product,
                            quantity,
                        },
                    ],
                });
            }
            localStorage.setItem(CART_LOCALSTORAGE_KEY, JSON.stringify(store.items())
            );
        },
        updatedQuantity(product: string, quantity: number) {
            const updatedItems = store
                .items()
                .map((item) =>
                    item.id === product ? { ...item, quantity } : item
                )
            patchState(store, { items: updatedItems });
            localStorage.setItem(CART_LOCALSTORAGE_KEY, JSON.stringify(store.items()));
        },
        removeFromCart(productid: string) {
            const updatedItems = store
                .items()
                .filter((item) => item.id !== productid);
            patchState(store, { items: updatedItems });
            localStorage.setItem(CART_LOCALSTORAGE_KEY, JSON.stringify(store.items()));
        },
        clearCart() {
            patchState(store, { items: [] });
            localStorage.removeItem(CART_LOCALSTORAGE_KEY);
        }
    }))
);
