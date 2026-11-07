import { ChangeDetectionStrategy, Component, inject, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CartStore } from '../../cart/cart.store';
import { AuthService } from '../../auth/auth.service';
import { CoffeePricePipe } from '../../coffee-price.pipe';

type PaymentMethod = 'PSE' | 'Tarjeta' | 'Nequi';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [FormsModule, CoffeePricePipe],
  templateUrl: './checkout.html',
  styleUrl: './checkout.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Checkout {
  readonly cart = inject(CartStore);
  readonly auth = inject(AuthService);
  readonly selectedPayment = signal<PaymentMethod>('PSE');
  readonly paymentMethods: readonly PaymentMethod[] = ['PSE', 'Tarjeta', 'Nequi'];
  readonly backRequested = output<void>();
  readonly payRequested = output<void>();
  readonly loginRequested = output<void>();
  readonly userName = signal<string>('');
  readonly userEmail = signal<string>('');

  constructor() {
    const user = this.auth.user();
    if (user) {
      this.userName.set(user.name);
      this.userEmail.set(user.email);
    }
  }

  get canPay(): boolean {
    return this.cart.itemCount() > 0;
  }

  get isLoggedIn(): boolean {
    return this.auth.isLoggedIn();
  }
}