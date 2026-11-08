import { ComponentFixture, TestBed } from '@angular/core/testing';
import { COFFEES } from '../../coffee.data';
import { Confirmation } from './confirmation';
import type { ConfirmedOrder } from './confirmation';

describe('Confirmation', () => {
  let fixture: ComponentFixture<Confirmation>;
  let order: ConfirmedOrder;

  beforeEach(async () => {
    order = {
      reference: 'SN-03621362',
      items: [{ coffee: COFFEES[0], quantity: 2 }],
      subtotal: COFFEES[0].price * 2,
      shipping: 0,
      total: COFFEES[0].price * 2,
      paymentMethod: 'nequi',
    };

    await TestBed.configureTestingModule({
      imports: [Confirmation],
    }).compileComponents();

    fixture = TestBed.createComponent(Confirmation);
    fixture.componentRef.setInput('order', order);
    fixture.detectChanges();
  });

  it('shows the simulated order reference, summary and selected payment method', () => {
    const content = fixture.nativeElement.textContent as string;

    expect(content).toContain('Pedido');
    expect(content).toContain('confirmado.');
    expect(content).toContain('SN-03621362');
    expect(content).toContain('Caturra');
    expect(content).toContain('Gratis');
    expect(content).toContain('Nequi');
    expect(content).toContain('no se realizó ningún cobro');
  });

  it('does not present an empty confirmation as a completed order', () => {
    fixture.componentRef.setInput('order', null);
    fixture.detectChanges();

    const content = fixture.nativeElement.textContent as string;
    expect(content).toContain('Aún no hay');
    expect(content).not.toContain('Pedido confirmado');
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
