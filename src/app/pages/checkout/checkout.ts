import { ChangeDetectionStrategy, Component, inject, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CartStore } from '../../cart/cart.store';
import { AuthService } from '../../auth/auth.service';
import { CoffeePricePipe } from '../../coffee-price.pipe';
import type { PaymentMethod, ShippingDetails } from '../../cart/purchase.models';

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
  readonly backRequested = output<void>();
  readonly checkoutRequested = output<PaymentMethod>();
  readonly loginRequested = output<void>();
  readonly submitting = signal(false);
  readonly submitted = signal(false);
  readonly errorMessage = signal('');
  readonly selectedPaymentMethod = signal<PaymentMethod>('pse');
  readonly paymentMethods: readonly { id: PaymentMethod; label: string }[] = [
    { id: 'pse', label: 'PSE' },
    { id: 'card', label: 'Tarjeta' },
    { id: 'nequi', label: 'Nequi' },
  ];
  readonly shippingForm = {
    name: this.auth.user()?.name ?? '',
    email: this.auth.user()?.email ?? '',
    phone: '',
    address: '',
    city: '',
    department: '',
  };

  get isLoggedIn(): boolean {
    return this.auth.isLoggedIn();
  }

  fieldError(field: keyof ShippingDetails): string {
    if (!this.submitted()) {
      return '';
    }

    const value = this.shippingForm[field].trim();
    if (!value) {
      return 'Este campo es obligatorio.';
    }
    if (
      value.length >
      { name: 120, email: 254, phone: 30, address: 180, city: 100, department: 100 }[field]
    ) {
      return 'El valor ingresado es demasiado largo.';
    }
    if (field === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return 'Ingresa un correo electrónico válido.';
    }
    if (field === 'phone' && !/^[+\d\s()-]{7,30}$/.test(value)) {
      return 'Ingresa un teléfono válido.';
    }
    return '';
  }

  private isShippingValid(): boolean {
    return (
      this.fieldError('name') === '' &&
      this.fieldError('email') === '' &&
      this.fieldError('phone') === '' &&
      this.fieldError('address') === '' &&
      this.fieldError('city') === '' &&
      this.fieldError('department') === ''
    );
  }

  startPayment(): void {
    if (this.submitting()) {
      return;
    }

    this.errorMessage.set('');
    if (this.cart.items().length === 0) {
      this.errorMessage.set('Tu bolsa está vacía. Agrega un café antes de continuar.');
      return;
    }
    this.submitted.set(true);
    if (!this.isShippingValid()) {
      return;
    }

    this.checkoutRequested.emit(this.selectedPaymentMethod());
  }
}