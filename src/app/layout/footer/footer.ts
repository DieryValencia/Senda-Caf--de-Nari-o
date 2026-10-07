import { ChangeDetectionStrategy, Component, output } from '@angular/core';

@Component({
  selector: 'app-footer',
  imports: [],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Footer {
  readonly navigate = output<'origen'>();

  go(view: 'origen'): void {
    this.navigate.emit(view);
  }
}
