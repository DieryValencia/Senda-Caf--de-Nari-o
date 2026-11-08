import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  PLATFORM_ID,
  signal,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { COFFEES, Coffee, VarietyGroup } from './coffee.data';
import { CartStore } from './cart/cart.store';
import { Bag } from './pages/bag/bag';
import { Checkout } from './pages/checkout/checkout';
import { Confirmation } from './pages/confirmation/confirmation';
import type { ConfirmedOrder } from './pages/confirmation/confirmation';
import { WompiCheckoutService } from './pages/checkout/wompi-checkout.service';
import { BottomNav } from './layout/bottom-nav/bottom-nav';
import { Footer } from './layout/footer/footer';
import { Header } from './layout/header/header';
import { Catalogo } from './pages/catalogo/catalogo';
import { Detalle } from './pages/detalle/detalle';
import { Inicio } from './pages/inicio/inicio';
import { LoginComponent } from './auth/login.component';
import { Origen } from './pages/origen/origen';
import { RegisterComponent } from './auth/register.component';

type View = 'inicio' | 'catalogo' | 'detalle' | 'origen' | 'checkout' | 'confirmation' | 'login' | 'register';

@Component({
  selector: 'app-root',
  imports: [Header, Footer, BottomNav, Inicio, Catalogo, Detalle, LoginComponent, Origen, RegisterComponent, Bag, Checkout, Confirmation],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  readonly cart = inject(CartStore);
  private readonly wompi = inject(WompiCheckoutService);
  private readonly platformId = inject(PLATFORM_ID);
  readonly view = signal<View>('inicio');
  readonly bagOpen = signal(false);
  readonly confirmedOrder = signal<ConfirmedOrder | null>(null);
  readonly verifyingPayment = signal(false);
  readonly verificationError = signal('');
  private readonly returnReference = signal('');
  private readonly returnTransactionId = signal('');
  readonly coffees = COFFEES;
  readonly selectedGroup = signal<VarietyGroup>('Todas');
  readonly selectedCoffee = signal<Coffee>(COFFEES[0]);
  readonly filteredCoffees = computed(() =>
    this.selectedGroup() === 'Todas'
      ? this.coffees
      : this.coffees.filter((coffee) => coffee.group === this.selectedGroup()),
  );

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      afterNextRender(() => this.processWompiReturn());
    }
  }

  navigate(view: View): void {
    this.view.set(view);
    this.bagOpen.set(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  openBag(): void {
    this.bagOpen.set(true);
  }

  addToBag(coffee: Coffee): void {
    this.cart.add(coffee);
    this.openBag();
  }

  continueToCheckout(): void {
    if (this.cart.itemCount() === 0) {
      return;
    }

    this.navigate('checkout');
  }

  backToBag(): void {
    this.bagOpen.set(true);
  }

  redirectToWompi(checkoutUrl: string): void {
    window.location.assign(checkoutUrl);
  }

  retryPaymentVerification(): void {
    if (this.returnReference() && this.returnTransactionId()) {
      void this.verifyPayment();
      return;
    }

    this.verificationError.set('No recibimos el identificador de transacción de Wompi.');
  }

  private processWompiReturn(): void {
    const url = new URL(window.location.href);
    const reference = url.searchParams.get('wompiReference');
    if (!reference) {
      return;
    }

    this.returnReference.set(reference);
    this.returnTransactionId.set(
      url.searchParams.get('id') ?? url.searchParams.get('transaction_id') ?? '',
    );
    this.view.set('confirmation');

    if (!this.returnTransactionId()) {
      this.verificationError.set('No recibimos el identificador de transacción de Wompi.');
      return;
    }
    void this.verifyPayment();
  }

  private async verifyPayment(): Promise<void> {
    this.verifyingPayment.set(true);
    this.verificationError.set('');
    try {
      const response = await this.wompi.verifyTransaction(
        this.returnReference(),
        this.returnTransactionId(),
      );
      this.confirmedOrder.set({
        ...response.order,
        status: response.status,
        transactionId: response.transactionId,
      });
      this.cart.restore(
        response.order.items.map((line) => {
          const coffee = COFFEES.find((entry) => entry.id === line.coffeeId);
          if (!coffee) {
            throw new Error('Wompi devolvió un producto que no está en el catálogo.');
          }
          return { coffee: { ...coffee, price: line.unitPrice }, quantity: line.quantity };
        }),
      );
    } catch (error) {
      this.verificationError.set(
        error instanceof HttpErrorResponse && typeof error.error?.message === 'string'
          ? error.error.message
          : 'No pudimos verificar el pago con Wompi. Intenta consultar de nuevo.',
      );
    } finally {
      this.verifyingPayment.set(false);
    }
  }

  openCoffee(coffee: Coffee): void {
    this.selectedCoffee.set(coffee);
    this.navigate('detalle');
  }
}