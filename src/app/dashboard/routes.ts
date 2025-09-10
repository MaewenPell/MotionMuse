import { Routes } from '@angular/router';
import { DashboardPageComponent } from './dashboard-page/dashboard-page.component';

export const dashboardRoutes: Routes = [
  {
    path: '',
    component: DashboardPageComponent,
    // canActivate: [StravaAuthGuard],
  },
];
