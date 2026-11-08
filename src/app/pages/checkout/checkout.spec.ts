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

  it('requires selected payment details and emits only the payment method', () => {
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
    component.startPayment();

    expect(component.paymentFieldError('nequiPhone')).toBe('Este campo es obligatorio.');
    expect(component.errorMessage()).toContain('datos del método de pago');

    component.paymentDetails.nequiPhone = '3001234567';
    let emittedValue: unknown;
    component.checkoutRequested.subscribe((value) => {
      emittedValue = value;
    });
    component.startPayment();

    expect(emittedValue).toBe('nequi');
    expect(typeof emittedValue).toBe('string');
    expect(component.paymentDetails.nequiPhone).toBe('');
  });

  it('requires PSE bank and document details', () => {
    cart.add(COFFEES[0]);
    Object.assign(component.shippingForm, {
      name: 'Oskar Valencia',
      email: 'oskar@example.com',
      phone: '+57 300 123 4567',
      address: 'Calle 1 # 2-3',
      city: 'Pasto',
      department: 'Nariño',
    });
    component.startPayment();

    expect(component.paymentFieldError('bank')).toBe('Este campo es obligatorio.');
    expect(component.paymentFieldError('documentNumber')).toBe(
      'Este campo es obligatorio.',
    );
    expect(component.errorMessage()).toContain('datos del método de pago');
  });

  it('requires card details without validating card formats', () => {
    cart.add(COFFEES[0]);
    Object.assign(component.shippingForm, {
      name: 'Oskar Valencia',
      email: 'oskar@example.com',
      phone: '+57 300 123 4567',
      address: 'Calle 1 # 2-3',
      city: 'Pasto',
      department: 'Nariño',
    });
    component.selectedPaymentMethod.set('card');
    component.startPayment();

    expect(component.paymentFieldError('cardNumber')).toBe('Este campo es obligatorio.');
    Object.assign(component.paymentDetails, {
      cardholder: 'Prueba',
      cardNumber: 'demo',
      cardExpiry: 'xx',
      cardCode: 'x',
    });
    let selectedMethod = '';
    component.checkoutRequested.subscribe((method) => {
      selectedMethod = method;
    });
    component.startPayment();

    expect(selectedMethod).toBe('card');
  });

  it('renders selectable payment methods with clean purchase copy', () => {
    const buttons = fixture.nativeElement.querySelectorAll('.payment-method') as NodeListOf<HTMLButtonElement>;
    const content = fixture.nativeElement.textContent as string;

    expect(buttons.length).toBe(3);
    expect(content).toContain('Confirmar pedido');
    expect(content).not.toContain('demostración');
    expect(content).not.toContain('simulación');
    expect(content).not.toContain('prueba');

    buttons[2].click();
    fixture.detectChanges();
    expect(buttons[2].getAttribute('aria-pressed')).toBe('true');
    expect(fixture.nativeElement.textContent).toContain('Número de celular asociado a Nequi');
  });
});
