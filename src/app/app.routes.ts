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
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
];
