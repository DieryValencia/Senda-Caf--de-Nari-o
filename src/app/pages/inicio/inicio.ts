import { ChangeDetectionStrategy, Component, output } from '@angular/core';

@Component({
  selector: 'app-inicio',
  imports: [],
  templateUrl: './inicio.html',
  styleUrl: './inicio.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Inicio {
  readonly navigate = output<'catalogo' | 'origen'>();

  go(view: 'catalogo' | 'origen'): void {
    this.navigate.emit(view);
  }
}
