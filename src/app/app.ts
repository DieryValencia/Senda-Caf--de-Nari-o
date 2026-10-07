import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { COFFEES, VarietyGroup } from './coffee.data';
import { BottomNav } from './layout/bottom-nav/bottom-nav';
import { Footer } from './layout/footer/footer';
import { Header } from './layout/header/header';
import { Catalogo } from './pages/catalogo/catalogo';
import { Inicio } from './pages/inicio/inicio';
import { Origen } from './pages/origen/origen';

type View = 'inicio' | 'catalogo' | 'origen';

@Component({
  selector: 'app-root',
  imports: [Header, Footer, BottomNav, Inicio, Catalogo, Origen],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  readonly view = signal<View>('inicio');
  readonly coffees = COFFEES;
  readonly selectedGroup = signal<VarietyGroup>('Todas');
  readonly filteredCoffees = computed(() =>
    this.selectedGroup() === 'Todas'
      ? this.coffees
      : this.coffees.filter((coffee) => coffee.group === this.selectedGroup()),
  );

  navigate(view: View): void {
    this.view.set(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
