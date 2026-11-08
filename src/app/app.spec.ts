import { TestBed } from '@angular/core/testing';
import { afterEach, vi } from 'vitest';
import { App } from './app';
import { AuthApi } from './auth/auth-api';
import { MockAuthApi } from './auth/mock-auth-api';
import { CartStore } from './cart/cart.store';
import { COFFEES } from './coffee.data';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [{ provide: AuthApi, useClass: MockAuthApi }],
    }).compileComponents();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render the home page', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.hero h1')?.textContent).toContain('Café de origen');
  });

  it('should navigate from home to the origin page', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();

    const regionalInfoButton = fixture.nativeElement.querySelector(
      '.origin-copy button',
    ) as HTMLButtonElement;
    const scrollTo = vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
    regionalInfoButton.click();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.origin-hero h1')?.textContent).toContain(
      'Producción de café',
    );
    expect(scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
  });

  it('completes a simulated order locally and clears the bag', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    const cart = TestBed.inject(CartStore);
    const scrollTo = vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
    cart.add(COFFEES[0]);

    app.confirmOrder('nequi');

    expect(app.view()).toBe('confirmation');
    expect(app.confirmedOrder()?.paymentMethod).toBe('nequi');
    expect(app.confirmedOrder()?.reference).toMatch(/^SN-\d{8}$/);
    expect(app.confirmedOrder()?.items).toEqual([{ coffee: COFFEES[0], quantity: 1 }]);
    expect(cart.items()).toEqual([]);
    expect(scrollTo).toHaveBeenCalled();
  });
});
