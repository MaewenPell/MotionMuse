import { Component } from '@angular/core';
import { SearchBarComponent } from '../../shared/search-bar/search-bar.component';
import { MenuComponent } from '../../shared/menu/menu.component';

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.scss'],
  standalone: true,
  imports: [SearchBarComponent, MenuComponent],
})
export class DashboardPageComponent {}
