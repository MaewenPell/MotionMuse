import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MenuModule } from 'primeng/menu';
import { APP_COLORS } from 'src/styles/_colorVariables';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, MenuModule, IconComponent, RouterModule],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent {
  public appColors = APP_COLORS;

  public dashboardActive: boolean = false;
}
