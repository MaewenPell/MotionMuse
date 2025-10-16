import { CommonModule } from '@angular/common';
import { Component, inject, input, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { DetailedAthlete } from 'src/app/types/athlete';
import { APP_COLORS } from 'src/styles/_colorVariables';
import { ConnectionService } from '../../services/connection.service';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [
    CommonModule,
    MenuModule,
    IconComponent,
    RouterModule,
    ButtonModule,
  ],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent {
  public connectionService = inject(ConnectionService);

  connectedAthlete = input<DetailedAthlete | null>();

  appColors = APP_COLORS;
  dashboardActive = signal(false);
}
