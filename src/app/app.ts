import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { COFFEES, Coffee, VarietyGroup } from './coffee.data';
import { CartStore } from './cart/cart.store';
import { Bag } from './pages/bag/bag';
import { BottomNav } from './layout/bottom-nav/bottom-nav';
import { Footer } from './layout/footer/footer';
import { Header } from './layout/header/header';
import { Catalogo } from './pages/catalogo/catalogo';
import { Detalle } from './pages/detalle/detalle';
import { Inicio } from './pages/inicio/inicio';
import { Origen } from './pages/origen/origen';

type View = 'inicio' | 'catalogo' | 'detalle' | 'origen';

@Component({
  selector: 'app-root',
  imports: [Header, Footer, BottomNav, Inicio, Catalogo, Detalle, Origen, Bag],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  readonly cart = inject(CartStore);
  readonly view = signal<View>('inicio');
  readonly bagOpen = signal(false);
  readonly coffees = COFFEES;
  readonly selectedGroup = signal<VarietyGroup>('Todas');
  readonly selectedCoffee = signal<Coffee>(COFFEES[0]);
  readonly filteredCoffees = computed(() =>
    this.selectedGroup() === 'Todas'
      ? this.coffees
      : this.coffees.filter((coffee) => coffee.group === this.selectedGroup()),
  );

  navigate(view: View): void {
    this.view.set(view);
    this.bagOpen.set(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  openBag(): void {
    this.bagOpen.set(true);
  }

  addToBag(coffee: Coffee): void {
    this.cart.add(coffee);
    this.openBag();
  }

  openCoffee(coffee: Coffee): void {
    this.selectedCoffee.set(coffee);
    this.navigate('detalle');
  }
}
