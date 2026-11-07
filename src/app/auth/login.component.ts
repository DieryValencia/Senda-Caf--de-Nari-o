import { Component, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, NgClass],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class LoginComponent {
  email = '';
  password = '';
  submitted = signal(false);
  error = '';

  readonly authenticated = output<void>();
  readonly goToRegister = output<void>();

  constructor(public auth: AuthService) {}

  async onSubmit(): Promise<void> {
    this.error = '';
    this.submitted.set(true);
    try {
      const success = await this.auth.login(this.email, this.password);
      if (success) {
        this.authenticated.emit();
      } else {
        this.error = 'Credenciales inválidas. Por favor intente nuevamente.';
        this.submitted.set(false);
      }
    } catch {
      this.error = 'Error en el inicio de sesión. Intente nuevamente.';
      this.submitted.set(false);
    }
  }
}
