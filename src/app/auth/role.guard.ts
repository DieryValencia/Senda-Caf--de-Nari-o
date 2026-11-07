import { CanActivateFn } from '@angular/router';
import { AuthService } from './auth.service';
import { inject } from '@angular/core';

export const roleGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  if (auth.isAdmin()) {
    return true;
  }
  return false;
};