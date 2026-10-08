import { ChangeDetectionStrategy, Component, output } from '@angular/core';

@Component({
  selector: 'app-bottom-nav',
  imports: [],
  templateUrl: './bottom-nav.html',
  styleUrl: './bottom-nav.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BottomNav {
  readonly navigate = output<'inicio' | 'catalogo'>();
  readonly bagRequested = output<void>();

  go(view: 'inicio' | 'catalogo'): void {
    this.navigate.emit(view);
  }
}
