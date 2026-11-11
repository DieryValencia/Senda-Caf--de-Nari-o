import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideAppHttpClient } from './http.auth.interceptor';
import { AuthApi } from './auth/auth-api';
import { MockAuthApi } from './auth/mock-auth-api';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideAppHttpClient(),
    { provide: AuthApi, useClass: MockAuthApi },
  ],
};