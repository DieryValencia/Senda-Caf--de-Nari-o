import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Coffee, VarietyGroup, VARIETY_GROUPS } from '../../coffee.data';
import { CoffeeCard } from './coffee-card';

@Component({
  selector: 'app-catalogo',
  imports: [CoffeeCard],
  templateUrl: './catalogo.html',
  styleUrl: './catalogo.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Catalogo {
  readonly coffees = input.required<readonly Coffee[]>();
  readonly totalCount = input.required<number>();
  readonly selectedGroup = input.required<VarietyGroup>();
  readonly groupSelected = output<VarietyGroup>();
  readonly groups = VARIETY_GROUPS;
}
