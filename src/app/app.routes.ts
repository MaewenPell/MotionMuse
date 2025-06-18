import { Route } from '@angular/router';
import { ConnectionComponent } from './core/connection/connection.component';
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
    loadChildren: () =>
      import('./trainings/routes').then(x => x.trainingsRoutes),
  },
  {
    path: 'token-exchange',
    loadComponent: () => TokenExhangeComponent,
  },
  {
    path: 'connection',
    loadComponent: () => ConnectionComponent,
  },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
];
