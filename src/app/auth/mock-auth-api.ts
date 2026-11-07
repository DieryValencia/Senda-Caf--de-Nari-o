import { inject, Signal, signal, computed } from '@angular/core';
import { LocalStorageService } from './localstorage.service';
import { User, Role, LoginRequest, RegisterRequest, AuthApi } from './auth-api';
const USERS_KEY = 'senda_mock_users';
const AUTH_KEY = 'senda_mock_auth';
const BLOCKED_KEY = 'senda_mock_blocked';
const ATTEMPTS_KEY = 'senda_mock_attempts';
const LOGIN_ATTEMPTS_MAX = 5;
const TOKEN_EXPIRATION_MINUTES = 120;
const ADMIN_EMAIL = 'admin@senda.coffee';
const ADMIN_PASSWORD = 'admin123';

export interface StoredUser extends User {
  passwordHash: string;
}

export class MockAuthApi extends AuthApi {
  private readonly localStorage = inject(LocalStorageService);

  private readonly _isLoggedIn = signal<boolean>(false);
  private readonly _user = signal<User | null>(null);
  private readonly _token = signal<string | null>(null);
  private readonly _isAdmin = computed(() => this._user()?.role === 'admin');

  get isLoggedIn(): Signal<boolean> {
    return this._isLoggedIn;
  }
  get user(): Signal<User | null> {
    return this._user;
  }
  get token(): Signal<string | null> {
    return this._token;
  }
  get isAdmin(): Signal<boolean> {
    return this._isAdmin;
  }

  constructor() {
    super();
    this.restoreFromLocalStorage();
    void this.seedAdmin();
  }

  private async seedAdmin(): Promise<void> {
    if (typeof localStorage === 'undefined') return;
    try {
      const users = this.getUsers();
      if (users.some((u) => u.email.toLowerCase() === ADMIN_EMAIL)) return;
      const passwordHash = await this.hashPassword(ADMIN_PASSWORD);
      const stored = this.getUsers();
      if (stored.some((u) => u.email.toLowerCase() === ADMIN_EMAIL)) return;
      const admin: StoredUser = {
        id: 1,
        name: 'Administrador',
        email: ADMIN_EMAIL,
        role: 'admin',
        passwordHash,
      };
      this.localStorage.setItem(USERS_KEY, [...stored, admin]);
    } catch {
      // Si Web Crypto no está disponible, se omite el seed del admin.
    }
  }

  restoreFromLocalStorage(): void {
    if (typeof localStorage === 'undefined') return;
    const stored = this.localStorage.getItem<{ token: string; user: User; expiresAt: string }>(AUTH_KEY);
    if (stored) {
      const expires = new Date(stored.expiresAt);
      if (Number.isNaN(expires.getTime()) || expires < new Date()) {
        this.logout();
        return;
      }
      this._token.set(stored.token);
      this._user.set(stored.user);
      this._isLoggedIn.set(true);
    } else {
      this._isLoggedIn.set(false);
      this._user.set(null);
      this._token.set(null);
    }
  }

  async login(request: LoginRequest): Promise<boolean> {
    if (typeof localStorage === 'undefined') return Promise.resolve(false);
    if (this.isBlocked()) return Promise.resolve(false);

    const users = this.getUsers();
    const user = users.find(
      (u) => u.email.toLowerCase() === request.email.toLowerCase(),
    );

    if (!user) {
      this.incrementAttempts();
      return Promise.resolve(false);
    }

    const passwordValid = await this.verifyPassword(request.password, user.passwordHash);
    if (!passwordValid) {
      this.incrementAttempts();
      return Promise.resolve(false);
    }

    this.clearAttempts();
    this.startSession(user);
    return Promise.resolve(true);
  }

  async register(request: RegisterRequest): Promise<boolean> {
    if (typeof localStorage === 'undefined') return Promise.resolve(false);

    const users = this.getUsers();
    const emailLower = request.email.toLowerCase();
    const existingUser = users.find((u) => u.email.toLowerCase() === emailLower);
    if (existingUser) return Promise.resolve(false);

    const passwordHash = await this.hashPassword(request.password);
    const user: StoredUser = {
      id: Date.now(),
      name: request.name,
      email: request.email,
      role: 'customer',
      passwordHash,
    };

    this.localStorage.setItem(USERS_KEY, [...users, user]);

    this.startSession(user);
    return Promise.resolve(true);
  }

  logout(): void {
    this._token.set(null);
    this._user.set(null);
    this._isLoggedIn.set(false);
    this.localStorage.removeItem(AUTH_KEY);
  }

  listUsers(): User[] {
    if (typeof localStorage === 'undefined') return [];
    return this.getUsers().map(({ passwordHash: _passwordHash, ...user }) => user);
  }

  removeUser(id: number): boolean {
    if (typeof localStorage === 'undefined') return false;
    if (this._user()?.id === id) return false;
    const users = this.getUsers();
    const next = users.filter((u) => u.id !== id);
    if (next.length === users.length) return false;
    this.localStorage.setItem(USERS_KEY, next);
    return true;
  }

  setUserRole(id: number, role: Role): boolean {
    if (typeof localStorage === 'undefined') return false;
    if (this._user()?.id === id) return false;
    const users = this.getUsers();
    if (!users.some((u) => u.id === id)) return false;
    this.localStorage.setItem(
      USERS_KEY,
      users.map((u) => (u.id === id ? { ...u, role } : u)),
    );
    return true;
  }

  private startSession(user: StoredUser): void {
    const { passwordHash: _passwordHash, ...safeUser } = user;
    const token = this.createToken(user);
    const expiresAt = new Date(Date.now() + TOKEN_EXPIRATION_MINUTES * 60_000).toISOString();
    this._token.set(token);
    this._user.set(safeUser);
    this._isLoggedIn.set(true);
    this.localStorage.setItem(AUTH_KEY, { token, user: safeUser, expiresAt });
  }

  private incrementAttempts(): void {
    if (typeof localStorage === 'undefined') return;
    let attempts = this.localStorage.getItem<number>(ATTEMPTS_KEY) || 0;
    attempts++;
    this.localStorage.setItem(ATTEMPTS_KEY, attempts);
    if (attempts >= LOGIN_ATTEMPTS_MAX) {
      this.localStorage.setItem(BLOCKED_KEY, String(Date.now()));
    }
  }

  private clearAttempts(): void {
    if (typeof localStorage === 'undefined') return;
    this.localStorage.removeItem(ATTEMPTS_KEY);
    this.localStorage.removeItem(BLOCKED_KEY);
  }

  private isBlocked(): boolean {
    if (typeof localStorage === 'undefined') return false;
    const blocked = this.localStorage.getItem<number>(BLOCKED_KEY);
    const attempts = this.localStorage.getItem<number>(ATTEMPTS_KEY);
    if (blocked && attempts && attempts >= LOGIN_ATTEMPTS_MAX) {
      const now = Date.now();
      const blockTime = Number(blocked);
      if (now - blockTime < 30000) {
        return true;
      } else {
        this.localStorage.removeItem(BLOCKED_KEY);
        this.localStorage.removeItem(ATTEMPTS_KEY);
      }
    }
    return false;
  }

  private async verifyPassword(password: string, storedHash: string): Promise<boolean> {
    const [saltB64, keyB64] = storedHash.split(':');
    const saltBytes = this.base64ToUint8Array(saltB64);
    const expectedKeyBytes = this.base64ToUint8Array(keyB64);

    const crypto = await window.crypto.subtle.importKey(
      'raw',
      saltBytes as any,
      'PBKDF2',
      false,
      ['deriveBits'],
    );

    const derivedKey = await window.crypto.subtle.deriveBits(
      {
        name: 'PBKDF2',
        salt: saltBytes as any,
        iterations: 100000,
        hash: 'SHA-256',
      },
      crypto,
      256,
    );

    const arraysEqual = new Uint8Array(derivedKey).length === expectedKeyBytes.length &&
      Array.from(new Uint8Array(derivedKey)).every(
        (a: number, i: number) => a === expectedKeyBytes[i],
      );

    return arraysEqual;
  }

  private async hashPassword(password: string): Promise<string> {
    const passwordBytes = new TextEncoder().encode(password);
    const saltBytes = window.crypto.getRandomValues(new Uint8Array(16));

    const crypto = await window.crypto.subtle.importKey(
      'raw',
      saltBytes as any,
      'PBKDF2',
      false,
      ['deriveBits'],
    );

    const derivedKey = await window.crypto.subtle.deriveBits(
      {
        name: 'PBKDF2',
        salt: saltBytes as any,
        iterations: 100000,
        hash: 'SHA-256',
      },
      crypto,
      256,
    );

    const hashBytes = new Uint8Array(derivedKey);
    const saltB64 = this.uint8ArrayToBase64(saltBytes);
    const hashB64 = this.uint8ArrayToBase64(hashBytes);

    return `${saltB64}:${hashB64}`;
  }

  private createToken(user: User): string {
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
      exp: Math.floor(Date.now() / 1000) + TOKEN_EXPIRATION_MINUTES * 60,
      iat: Math.floor(Date.now() / 1000),
    };
    const jwt = btoa(JSON.stringify(payload));
    return btoa(`${user.email}:${jwt}:${Date.now()}`);
  }

  private getUsers(): StoredUser[] {
    if (typeof localStorage === 'undefined') return [];
    const users = this.localStorage.getItem<StoredUser[]>(USERS_KEY);
    return users || [];
  }

  private base64ToUint8Array(b64: string): Uint8Array {
    const binaryString = atob(b64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  }

  private uint8ArrayToBase64(arr: Uint8Array): string {
    let binary = '';
    for (let i = 0; i < arr.length; i++) {
      binary += String.fromCharCode(arr[i]);
    }
    return btoa(binary);
  }
}