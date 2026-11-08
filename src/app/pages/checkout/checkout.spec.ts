import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { CartStore } from '../../cart/cart.store';
import { COFFEES } from '../../coffee.data';
import { Checkout } from './checkout';

describe('Checkout', () => {
  let fixture: ComponentFixture<Checkout>;
  let component: Checkout;
  let cart: CartStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Checkout],
      providers: [
        CartStore,
        {
          provide: AuthService,
          useValue: {
            isLoggedIn: () => true,
            user: signal({ name: 'Oskar Valencia', email: 'oskar@example.com' }),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Checkout);
    component = fixture.componentInstance;
    cart = TestBed.inject(CartStore);
    fixture.detectChanges();
  });

  it('requires shipping data and does not complete an invalid checkout', () => {
    cart.add(COFFEES[0]);
    let completed = false;
    component.checkoutRequested.subscribe(() => {
      completed = true;
    });

    component.startPayment();

    expect(component.submitted()).toBe(true);
    expect(component.fieldError('phone')).toBe('Este campo es obligatorio.');
    expect(completed).toBe(false);
  });

  it('simulates checkout with the selected method and no external payment service', () => {
    cart.add(COFFEES[0]);
    Object.assign(component.shippingForm, {
      name: 'Oskar Valencia',
      email: 'oskar@example.com',
      phone: '+57 300 123 4567',
      address: 'Calle 1 # 2-3',
      city: 'Pasto',
      department: 'Nariño',
    });
    component.selectedPaymentMethod.set('nequi');
    let selectedMethod = '';
    component.checkoutRequested.subscribe((method) => {
      selectedMethod = method;
    });

    component.startPayment();

    expect(selectedMethod).toBe('nequi');
    expect(component.errorMessage()).toBe('');
  });

  it('renders selectable payment method buttons and clearly labels the simulation', () => {
    const buttons = fixture.nativeElement.querySelectorAll('.payment-method') as NodeListOf<HTMLButtonElement>;
    const content = fixture.nativeElement.textContent as string;

    expect(buttons.length).toBe(3);
    expect(content).toContain('Pagar (simulación)');
    expect(content).toContain('no se realiza ningún cobro');

    buttons[2].click();
    fixture.detectChanges();
    expect(buttons[2].getAttribute('aria-pressed')).toBe('true');
  });
});
