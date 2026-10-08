import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { COFFEES, Coffee } from '../../coffee.data';

@Component({
  selector: 'app-inicio',
  imports: [],
  templateUrl: './inicio.html',
  styleUrl: './inicio.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Inicio {
  readonly navigate = output<'catalogo' | 'origen'>();
  readonly addRequested = output<Coffee>();
  readonly featuredCoffees = COFFEES.slice(0, 3);
  readonly featuredPrices = this.featuredCoffees.map(
    (coffee) => `$ ${coffee.price.toLocaleString('es-CO')}`,
  );

  go(view: 'catalogo' | 'origen'): void {
    this.navigate.emit(view);
  }
}
