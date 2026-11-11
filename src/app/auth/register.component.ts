import { Component, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, NgClass],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class RegisterComponent {
  name = '';
  email = '';
  password = '';
  submitted = signal(false);
  error = '';

  readonly authenticated = output<void>();
  readonly goToLogin = output<void>();

  constructor(public auth: AuthService) {}

  async onSubmit(): Promise<void> {
    this.error = '';
    this.submitted.set(true);
    try {
      const success = await this.auth.register(this.name, this.email, this.password);
      if (success) {
        this.authenticated.emit();
      } else {
        this.error = 'El correo electrónico ya está registrado. Por favor use otro.';
        this.submitted.set(false);
      }
    } catch {
      this.error = 'Error en el registro. Intente nuevamente.';
      this.submitted.set(false);
    }
  }
}
