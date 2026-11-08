import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { PaymentStatus, PurchaseSummary } from '../../cart/purchase.models';
import { CoffeePricePipe } from '../../coffee-price.pipe';

export interface ConfirmedOrder extends PurchaseSummary {
  readonly status: PaymentStatus;
  readonly transactionId: string;
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
  readonly checking = input(false);
  readonly errorMessage = input('');
  readonly homeRequested = output<void>();
  readonly retryRequested = output<void>();
  readonly checkoutRequested = output<void>();
}
