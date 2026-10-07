import { ChangeDetectionStrategy, Component, output, signal } from '@angular/core';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Header {
  readonly navigate = output<'inicio' | 'catalogo' | 'origen'>();
  readonly menuOpen = signal(false);

  go(view: 'inicio' | 'catalogo' | 'origen'): void {
    this.navigate.emit(view);
    this.menuOpen.set(false);
  }

  toggleMenu(): void {
    this.menuOpen.update((isOpen) => !isOpen);
  }
}
