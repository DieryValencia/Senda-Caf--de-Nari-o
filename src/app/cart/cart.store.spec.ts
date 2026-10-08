import { TestBed } from '@angular/core/testing';
import { COFFEES } from '../coffee.data';
import { CartStore, FREE_SHIPPING_THRESHOLD, SHIPPING_FEE } from './cart.store';

describe('CartStore', () => {
  let cart: CartStore;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [CartStore] });
    cart = TestBed.inject(CartStore);
  });

  it('adds products and increments quantity for a product already in the bag', () => {
    const coffee = COFFEES[0];

    cart.add(coffee);
    cart.add(coffee);

    expect(cart.items()).toEqual([{ coffee, quantity: 2 }]);
    expect(cart.itemCount()).toBe(2);
    expect(cart.subtotal()).toBe(coffee.price * 2);
  });

  it('charges shipping below the free-shipping threshold', () => {
    cart.add({ ...COFFEES[0], price: FREE_SHIPPING_THRESHOLD - 1 });

    expect(cart.shipping()).toBe(SHIPPING_FEE);
    expect(cart.total()).toBe(FREE_SHIPPING_THRESHOLD - 1 + SHIPPING_FEE);
  });

  it('makes shipping free at the threshold and removes a line when its quantity reaches zero', () => {
    const coffee = { ...COFFEES[0], price: FREE_SHIPPING_THRESHOLD };
    cart.add(coffee);

    expect(cart.shipping()).toBe(0);
    expect(cart.total()).toBe(FREE_SHIPPING_THRESHOLD);

    cart.adjustQuantity(coffee.id, -1);
    expect(cart.items()).toEqual([]);
    expect(cart.total()).toBe(0);
  });
});
