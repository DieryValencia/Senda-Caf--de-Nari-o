import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Coffee } from '../../coffee.data';
import { CoffeePricePipe } from '../../coffee-price.pipe';

@Component({
  selector: 'app-coffee-card',
  imports: [CoffeePricePipe],
  templateUrl: './coffee-card.html',
  styleUrl: './coffee-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CoffeeCard {
  readonly coffee = input.required<Coffee>();
  readonly viewRequested = output<Coffee>();
  readonly addRequested = output<Coffee>();
}
