import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withInterceptorsFromDi
} from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { AuthHttpInterceptor, provideAuth0 } from '@auth0/auth0-angular';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { providePrimeNG } from 'primeng/config';
import { AppComponent } from './app/app.component';
import { APP_ROUTES } from './app/app.routes';
import MotionMusePreset from './assets/presets/motion-muse.preset';
import { environment } from './environments/environment';

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(BrowserModule),
    provideRouter(APP_ROUTES),
    provideHttpClient(withInterceptorsFromDi()),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthHttpInterceptor,
      multi: true,
    },
    // { provide: HTTP_INTERCEPTORS, useClass: StravaInterceptor, multi: true },
    providePrimeNG({
      theme: {
        preset: MotionMusePreset,
        options: { darkModeSelector: '.p-dark' },
      },
    }),
    provideCharts(withDefaultRegisterables()),
    provideAuth0({...environment.auth0, httpInterceptor: environment.httpInterceptor}),
  ],
}).catch(err => console.error(err));
