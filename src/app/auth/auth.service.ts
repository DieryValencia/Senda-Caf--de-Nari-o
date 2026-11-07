import { inject, Injectable } from '@angular/core';
import { AuthApi, Role, User } from './auth-api';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly auth = inject(AuthApi);

  readonly isLoggedIn = this.auth.isLoggedIn;
  readonly user = this.auth.user;
  readonly token = this.auth.token;
  readonly isAdmin = this.auth.isAdmin;

  constructor() {
    this.auth.restoreFromLocalStorage();
  }

  login(email: string, password: string): Promise<boolean> {
    return Promise.resolve(this.auth.login({ email, password }));
  }

  register(name: string, email: string, password: string): Promise<boolean> {
    return Promise.resolve(this.auth.register({ name, email, password }));
  }

  logout(): void {
    this.auth.logout();
  }

  getCurrentUser(): User | null {
    return this.user();
  }

  listUsers(): User[] {
    return this.auth.listUsers();
  }

  removeUser(id: number): boolean {
    return this.auth.removeUser(id);
  }

  setUserRole(id: number, role: Role): boolean {
    return this.auth.setUserRole(id, role);
  }
}
