import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Coffee } from '../../coffee.data';
import { CoffeePricePipe } from '../../coffee-price.pipe';

@Component({
  selector: 'app-traceability',
  imports: [CoffeePricePipe],
  templateUrl: './traceability.html',
  styleUrl: './traceability.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Traceability {
  readonly coffee = input.required<Coffee>();
}
