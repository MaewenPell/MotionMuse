import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardPageComponent } from './dashboard-page/dashboard-page.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { SearchBarComponent } from '../shared/search-bar/search-bar.component';

@NgModule({
  imports: [CommonModule, DashboardRoutingModule, SearchBarComponent],
  declarations: [DashboardPageComponent],
})
export class DashboardModule {}
