import { Route } from '@angular/router';
import { TokenExchangeComponent } from './shared/token-exchange/token-exchange.component';

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
    loadComponent: () => TokenExchangeComponent,
  },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
];
