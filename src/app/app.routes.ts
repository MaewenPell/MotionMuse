import { Route } from '@angular/router';

export const APP_ROUTES: Route[] = [
  {
    path: 'dashboard',
    loadChildren: () => import('./dashboard/routes'),
  },
  {
    path: 'trainings',
    loadChildren: () => import('./trainings/routes'),
  },
  {
    path: 'token-exchange',
    redirectTo: 'dashboard',
  },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
];
