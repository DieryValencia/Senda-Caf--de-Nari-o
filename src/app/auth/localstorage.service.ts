import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class LocalStorageService {
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  getItem<T>(key: string): T | null {
    if (!this.isBrowser) return null;
    const item = localStorage.getItem(key);
    return item ? (JSON.parse(item) as T) : null;
  }

  setItem(key: string, value: unknown): void {
    if (!this.isBrowser) return;
    localStorage.setItem(key, JSON.stringify(value));
  }

  removeItem(key: string): void {
    if (!this.isBrowser) return;
    localStorage.removeItem(key);
  }
}
