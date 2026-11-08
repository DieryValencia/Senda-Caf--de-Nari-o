import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import type { CartLine } from '../../cart/cart.store';
import type { PaymentMethod } from '../../cart/purchase.models';
import { CoffeePricePipe } from '../../coffee-price.pipe';

export interface ConfirmedOrder {
  readonly reference: string;
  readonly items: readonly CartLine[];
  readonly subtotal: number;
  readonly shipping: number;
  readonly total: number;
  readonly paymentMethod: PaymentMethod;
}

@Component({
  selector: 'app-confirmation',
  imports: [CoffeePricePipe],
  templateUrl: './confirmation.html',
  styleUrl: './confirmation.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Confirmation {
  readonly order = input<ConfirmedOrder | null>(null);
  readonly homeRequested = output<void>();

  paymentMethodLabel(method: PaymentMethod): string {
    return { pse: 'PSE', card: 'Tarjeta', nequi: 'Nequi' }[method];
  }
}
