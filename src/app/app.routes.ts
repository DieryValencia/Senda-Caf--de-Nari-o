import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login.component';
import { RegisterComponent } from './auth/register.component';
import { authGuard as authGuardFn, publicGuard as publicGuardFn } from './auth/auth.guard';
import { Checkout } from './pages/checkout/checkout';
import { Confirmation } from './pages/confirmation/confirmation';

export const routes: Routes = [
  { path: 'login', component: LoginComponent, canActivate: [publicGuardFn] },
  { path: 'register', component: RegisterComponent, canActivate: [publicGuardFn] },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'checkout', component: Checkout, canActivate: [authGuardFn] },
  { path: 'confirmation', component: Confirmation, canActivate: [authGuardFn] },
  { path: '**', redirectTo: '/login' },
];