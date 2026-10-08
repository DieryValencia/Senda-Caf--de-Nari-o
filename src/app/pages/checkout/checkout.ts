import { ChangeDetectionStrategy, Component, inject, output, signal } from '@angular/core';
import { CartStore } from '../../cart/cart.store';
import { CoffeePricePipe } from '../../coffee-price.pipe';

type PaymentMethod = 'PSE' | 'Tarjeta' | 'Nequi';

@Component({
  selector: 'app-checkout',
  imports: [CoffeePricePipe],
  templateUrl: './checkout.html',
  styleUrl: './checkout.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Checkout {
  readonly cart = inject(CartStore);
  readonly selectedPayment = signal<PaymentMethod>('PSE');
  readonly paymentMethods: readonly PaymentMethod[] = ['PSE', 'Tarjeta', 'Nequi'];
  readonly backRequested = output<void>();
  readonly payRequested = output<void>();
}
