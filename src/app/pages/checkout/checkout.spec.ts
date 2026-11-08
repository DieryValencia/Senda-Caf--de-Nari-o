import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { vi } from 'vitest';
import { AuthService } from '../../auth/auth.service';
import { CartStore } from '../../cart/cart.store';
import { COFFEES } from '../../coffee.data';
import type { WompiCheckoutResponse } from '../../cart/purchase.models';
import { Checkout } from './checkout';
import { WompiCheckoutService } from './wompi-checkout.service';

describe('Checkout', () => {
  let fixture: ComponentFixture<Checkout>;
  let component: Checkout;
  let cart: CartStore;
  const createOrder = vi.fn<WompiCheckoutService['createOrder']>();

  beforeEach(async () => {
    createOrder.mockReset();
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
        {
          provide: WompiCheckoutService,
          useValue: { createOrder, verifyTransaction: vi.fn() },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Checkout);
    component = fixture.componentInstance;
    cart = TestBed.inject(CartStore);
    fixture.detectChanges();
  });

  it('requires shipping data and does not request a checkout for an invalid form', async () => {
    cart.add(COFFEES[0]);
    await component.startPayment();

    expect(component.submitted()).toBe(true);
    expect(component.fieldError('phone')).toBe('Este campo es obligatorio.');
    expect(createOrder).not.toHaveBeenCalled();
  });

  it('sends shipping details and product quantities to the server, not client prices', async () => {
    cart.add(COFFEES[0]);
    Object.assign(component.shippingForm, {
      name: 'Oskar Valencia',
      email: 'oskar@example.com',
      phone: '+57 300 123 4567',
      address: 'Calle 1 # 2-3',
      city: 'Pasto',
      department: 'Nariño',
    });

    const checkoutResponse: WompiCheckoutResponse = {
      checkoutUrl: 'https://checkout.wompi.co/p/?reference=SN-TEST',
      order: {
        reference: 'SN-TEST',
        items: [{
          coffeeId: COFFEES[0].id,
          name: COFFEES[0].name,
          quantity: 1,
          unitPrice: COFFEES[0].price,
          imageUrl: COFFEES[0].cardImage,
        }],
        subtotal: COFFEES[0].price,
        shipping: 8_000,
        total: COFFEES[0].price + 8_000,
      },
    };
    createOrder.mockResolvedValue(checkoutResponse);
    let checkoutUrl = '';
    component.checkoutRequested.subscribe((url) => {
      checkoutUrl = url;
    });

    await component.startPayment();

    expect(createOrder).toHaveBeenCalledWith({
      shipping: {
        name: 'Oskar Valencia',
        email: 'oskar@example.com',
        phone: '+57 300 123 4567',
        address: 'Calle 1 # 2-3',
        city: 'Pasto',
        department: 'Nariño',
      },
      items: [{ coffeeId: COFFEES[0].id, quantity: 1 }],
    });
    expect(checkoutUrl).toBe(checkoutResponse.checkoutUrl);
  });
});
