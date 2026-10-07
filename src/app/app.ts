import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { BottomNav } from './layout/bottom-nav/bottom-nav';
import { Footer } from './layout/footer/footer';
import { Header } from './layout/header/header';
import { Inicio } from './pages/inicio/inicio';
import { Origen } from './pages/origen/origen';

type View = 'inicio' | 'origen';

@Component({
  selector: 'app-root',
  imports: [Header, Footer, BottomNav, Inicio, Origen],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  readonly view = signal<View>('inicio');

  navigate(view: View): void {
    this.view.set(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
