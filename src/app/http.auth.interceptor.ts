import { HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpInterceptorFn, provideHttpClient, withInterceptors } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

export const httpAuthInterceptor: HttpInterceptorFn = (request, next) => {
  const auth = inject(AuthService);
  const authToken = auth.token();

  if (authToken) {
    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${authToken}`,
      },
    });
  }

  return next(request).pipe(
    catchError((error: any) => {
      if (error.status === 401) {
        auth.logout();
      }
      return throwError(() => error);
    }),
  );
};

export const provideAppHttpClient = () => provideHttpClient(withInterceptors([httpAuthInterceptor]));