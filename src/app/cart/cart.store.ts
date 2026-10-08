import { computed, Injectable, signal } from '@angular/core';
import { Coffee } from '../coffee.data';

export interface CartLine {
  readonly coffee: Coffee;
  readonly quantity: number;
}

export const FREE_SHIPPING_THRESHOLD = 100_000;
export const SHIPPING_FEE = 8_000;

@Injectable({ providedIn: 'root' })
export class CartStore {
  readonly items = signal<readonly CartLine[]>([]);
  readonly itemCount = computed(() =>
    this.items().reduce((count, line) => count + line.quantity, 0),
  );
  readonly subtotal = computed(() =>
    this.items().reduce((sum, line) => sum + line.coffee.price * line.quantity, 0),
  );
  readonly remainingForFreeShipping = computed(() =>
    Math.max(0, FREE_SHIPPING_THRESHOLD - this.subtotal()),
  );
  readonly shipping = computed(() =>
    this.itemCount() > 0 && this.subtotal() < FREE_SHIPPING_THRESHOLD ? SHIPPING_FEE : 0,
  );
  readonly total = computed(() => this.subtotal() + this.shipping());
  readonly shippingProgress = computed(() =>
    Math.min(100, (this.subtotal() / FREE_SHIPPING_THRESHOLD) * 100),
  );

  add(coffee: Coffee): void {
    this.items.update((items) => {
      const existing = items.find((line) => line.coffee.id === coffee.id);
      if (existing) {
        return items.map((line) =>
          line.coffee.id === coffee.id ? { ...line, quantity: line.quantity + 1 } : line,
        );
      }

      return [...items, { coffee, quantity: 1 }];
    });
  }

  adjustQuantity(coffeeId: number, adjustment: -1 | 1): void {
    this.items.update((items) =>
      items.flatMap((line) => {
        if (line.coffee.id !== coffeeId) {
          return [line];
        }

        const quantity = line.quantity + adjustment;
        return quantity > 0 ? [{ ...line, quantity }] : [];
      }),
    );
  }

  remove(coffeeId: number): void {
    this.items.update((items) => items.filter((line) => line.coffee.id !== coffeeId));
  }
}
