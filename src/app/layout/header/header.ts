import { ChangeDetectionStrategy, Component, inject, input, output, computed, signal } from '@angular/core';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.html',
  styleUrl: './header.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Header {
  readonly navigate = output<'inicio' | 'catalogo' | 'origen' | 'login' | 'register'>();
  readonly bagRequested = output<void>();
  readonly itemCount = input.required<number>();
  readonly menuOpen = signal(false);
  public auth = inject(AuthService);

  readonly isLoggedIn = computed(() => this.auth.isLoggedIn());
  readonly user = computed(() => this.auth.user());

  go(view: 'inicio' | 'catalogo' | 'origen'): void {
    this.navigate.emit(view);
  }

  toggleMenu(): void {
    this.menuOpen.update((isOpen) => !isOpen);
  }

  logout(): void {
    this.auth.logout();
    this.navigate.emit('login');
  }
}