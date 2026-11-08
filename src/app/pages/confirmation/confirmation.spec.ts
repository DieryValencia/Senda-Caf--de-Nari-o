import { ComponentFixture, TestBed } from '@angular/core/testing';
import { COFFEES } from '../../coffee.data';
import { Confirmation } from './confirmation';
import type { ConfirmedOrder } from './confirmation';

describe('Confirmation', () => {
  let fixture: ComponentFixture<Confirmation>;
  let order: ConfirmedOrder;

  beforeEach(async () => {
    order = {
      reference: 'SN-TEST-ORDER',
      items: [{
        coffeeId: COFFEES[0].id,
        name: COFFEES[0].name,
        quantity: 2,
        unitPrice: COFFEES[0].price,
        imageUrl: COFFEES[0].cardImage,
      }],
      subtotal: COFFEES[0].price * 2,
      shipping: 0,
      total: COFFEES[0].price * 2,
      status: 'approved',
      transactionId: 'transaction-123',
    };

    await TestBed.configureTestingModule({
      imports: [Confirmation],
    }).compileComponents();

    fixture = TestBed.createComponent(Confirmation);
    fixture.componentRef.setInput('order', order);
    fixture.detectChanges();
  });

  it('shows an approved order only after server verification', () => {
    const content = fixture.nativeElement.textContent as string;

    expect(content).toContain('Pedido');
    expect(content).toContain('SN-TEST-ORDER');
    expect(content).toContain('Caturra');
    expect(content).toContain('Gratis');
    expect(content).toContain('Tu pago fue verificado por Wompi');
  });

  it('shows pending orders without presenting them as confirmed', () => {
    fixture.componentRef.setInput('order', { ...order, status: 'pending' });
    fixture.detectChanges();

    const content = fixture.nativeElement.textContent as string;
    expect(content).toContain('Pago');
    expect(content).toContain('pendiente.');
    expect(content).not.toContain('Pedido confirmado');
    expect(content).toContain('Consultar de nuevo');
  });

  it('emits a request to return home', () => {
    let homeRequested = false;
    fixture.componentInstance.homeRequested.subscribe(() => {
      homeRequested = true;
    });

    const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    button.click();

    expect(homeRequested).toBe(true);
  });
});
