import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  output,
  viewChild,
} from '@angular/core';
import { CartStore } from '../../cart/cart.store';
import { CoffeePricePipe } from '../../coffee-price.pipe';

@Component({
  selector: 'app-bag',
  imports: [CoffeePricePipe],
  templateUrl: './bag.html',
  styleUrl: './bag.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Bag {
  private readonly drawer = viewChild.required<ElementRef<HTMLDialogElement>>('drawer');
  readonly cart = inject(CartStore);
  readonly closeRequested = output<void>();
  readonly checkoutRequested = output<void>();
  readonly catalogRequested = output<void>();

  constructor() {
    afterNextRender(() => this.drawer().nativeElement.showModal());
  }

  closeOnBackdrop(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.closeRequested.emit();
    }
  }
}
