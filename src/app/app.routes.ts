import { Route } from '@angular/router';
import { ConnectionComponent } from './core/connection/connection.component';
import { TokenExhangeComponent } from './core/token-exhange/token-exhange.component';
import { RegisterFormComponent } from './shared/components/register-form/register-form.component';

export const APP_ROUTES: Route[] = [
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./dashboard/routes').then(x => x.dashboardRoutes),
    // canActivate: [StravaAuthGuard],
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
    children: [
      {
        path: 'register',
        loadComponent: () => RegisterFormComponent,
      },
      {
        path: 'login',
        loadComponent: () => RegisterFormComponent,
      },
    ],
  },
  {
    path: '',
    redirectTo: 'connection',
    pathMatch: 'full',
  },
];
