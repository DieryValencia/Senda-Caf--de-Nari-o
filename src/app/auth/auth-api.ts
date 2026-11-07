import { Signal } from '@angular/core';

export type Role = 'customer' | 'admin';

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
  createdAt?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  expiresAt: string;
}

export abstract class AuthApi {
  abstract readonly isLoggedIn: Signal<boolean>;
  abstract readonly user: Signal<User | null>;
  abstract readonly token: Signal<string | null>;
  abstract readonly isAdmin: Signal<boolean>;

  abstract login(request: LoginRequest): boolean | Promise<boolean>;
  abstract register(request: RegisterRequest): boolean | Promise<boolean>;
  abstract logout(): void;
  abstract restoreFromLocalStorage(): void;

  abstract listUsers(): User[];
  abstract removeUser(id: number): boolean;
  abstract setUserRole(id: number, role: Role): boolean;
}