import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CartLine } from '../../cart/cart.store';
import { CoffeePricePipe } from '../../coffee-price.pipe';

export interface ConfirmedOrder {
  readonly items: readonly CartLine[];
  readonly subtotal: number;
  readonly shipping: number;
  readonly total: number;
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
  readonly orderNumber = 'SN-03621362';
  readonly homeRequested = output<void>();
}
