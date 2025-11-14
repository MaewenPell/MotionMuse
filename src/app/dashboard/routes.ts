import { Routes } from '@angular/router';
import { AuthGuard } from '@auth0/auth0-angular';
import { DashboardPageComponent } from './dashboard-page/dashboard-page.component';

export const dashboardRoutes: Routes = [
  {
    path: '',
    component: DashboardPageComponent,
    canActivate: [AuthGuard],
  },
];
