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
import { ActivatedRouteSnapshot, provideRouter } from '@angular/router';
import { providePrimeNG } from 'primeng/config';
import { AppComponent } from './app/app.component';
import { APP_ROUTES } from './app/app.routes';
import { StravaInterceptor } from './app/core/interceptor/strava.interceptor';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import MotionMusePreset from './assets/presets/motion-muse.preset';

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(BrowserModule),
    provideRouter(APP_ROUTES),
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
  ],
}).catch(err => console.error(err));
