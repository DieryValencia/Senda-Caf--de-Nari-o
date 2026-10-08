import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Coffee } from '../../coffee.data';
import { CoffeePricePipe } from '../../coffee-price.pipe';
import { Traceability } from './traceability';

@Component({
  selector: 'app-detalle',
  imports: [CoffeePricePipe, Traceability],
  templateUrl: './detalle.html',
  styleUrl: './detalle.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Detalle {
  readonly coffee = input.required<Coffee>();
  readonly backRequested = output<void>();
  readonly addRequested = output<Coffee>();
}
