import { ComponentFixture, TestBed } from '@angular/core/testing';
import { COFFEES } from '../../coffee.data';
import { ConfirmedOrder, Confirmation } from './confirmation';

describe('Confirmation', () => {
  let fixture: ComponentFixture<Confirmation>;
  let order: ConfirmedOrder;

  beforeEach(async () => {
    order = {
      items: [{ coffee: COFFEES[0], quantity: 2 }],
      subtotal: COFFEES[0].price * 2,
      shipping: 0,
      total: COFFEES[0].price * 2,
    };

    await TestBed.configureTestingModule({
      imports: [Confirmation],
    }).compileComponents();

    fixture = TestBed.createComponent(Confirmation);
    fixture.componentRef.setInput('order', order);
    fixture.detectChanges();
  });

  it('shows the order number and a frozen order summary', () => {
    const content = fixture.nativeElement.textContent as string;

    expect(content).toContain('Pedido');
    expect(content).toContain('SN-03621362');
    expect(content).toContain('Caturra');
    expect(content).toContain('Gratis');
    expect(content).toContain('No se procesó ningún pago');
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
