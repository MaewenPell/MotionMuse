import { Route, Routes } from '@angular/router';
import { TrainingPageComponent } from './training-page/training-page.component';

export const trainingsRoutes: Routes = [
  {
    path: '',
    component: TrainingPageComponent,
  },
] as Route[];
