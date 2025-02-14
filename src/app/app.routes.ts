import { Route } from '@angular/router';
import { TokenExhangeComponent } from './core/token-exhange/token-exhange.component';
import { StravaAuthGuard } from './guards/strava-auth.guard';

export const APP_ROUTES: Route[] = [
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./dashboard/routes').then(x => x.dashboardRoutes),
    canActivate: [StravaAuthGuard],
  },
  {
    path: 'trainings',
    loadChildren: () => import('./trainings/routes').then(x => x.default),
  },
  {
    path: 'token-exchange',
    loadComponent: () => TokenExhangeComponent,
  },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
];
