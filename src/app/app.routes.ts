import { Route } from '@angular/router';
import { AuthGuard } from '@auth0/auth0-angular';
import { ConnectionComponent } from './core/connection/connection.component';
import { ErrorComponent } from './error/error.component';
import { RegisterFormComponent } from './shared/components/register-form/register-form.component';

export const APP_ROUTES: Route[] = [
  {
    path: 'callback',
    loadComponent: () => ConnectionComponent,
  },
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./dashboard/routes').then(x => x.dashboardRoutes),
    canActivate: [AuthGuard],
  },
  {
    path: 'trainings',
    loadChildren: () =>
      import('./trainings/routes').then(x => x.trainingsRoutes),
    canActivate: [AuthGuard],
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
    path: 'error',
    loadComponent: () => ErrorComponent,
  },
  {
    path: '',
    redirectTo: 'connection',
    pathMatch: 'full',
  },
];
