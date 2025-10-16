import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import {
  provideAnimations,
  provideNoopAnimations,
} from '@angular/platform-browser/animations';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter, withDebugTracing } from '@angular/router';
import { provideAuth0 } from '@auth0/auth0-angular';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { providePrimeNG } from 'primeng/config';
import { AppComponent } from './app/app.component';
import { APP_ROUTES } from './app/app.routes';
import { StravaInterceptor } from './app/core/interceptor/strava.interceptor';
import MotionMusePreset from './assets/presets/motion-muse.preset';
import { environment } from './environments/environment';

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(BrowserModule),
    provideRouter(APP_ROUTES, withDebugTracing()), // Enable router tracing
    provideAnimations(),
    provideHttpClient(withInterceptorsFromDi()),
    { provide: HTTP_INTERCEPTORS, useClass: StravaInterceptor, multi: true },
    provideNoopAnimations(),
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: MotionMusePreset,
      },
    }),
    provideCharts(withDefaultRegisterables()),
    provideAuth0(environment.auth0),
  ],
}).catch(err => console.error(err));
