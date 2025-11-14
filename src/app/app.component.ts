import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { StepperModule } from 'primeng/stepper';
import { MenuComponent } from './shared/components/menu/menu.component';
import { ConnectionService } from './shared/services/connection.service';
import { StravaService } from './shared/services/strava.service';
import { DetailedAthlete } from './types/athlete';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [RouterOutlet, MenuComponent, StepperModule, ButtonModule],
  providers: [StravaService, MessageService],
})
export class AppComponent {
  private stravaService = inject(StravaService);
  connectionService = inject(ConnectionService);

  connectedAthlete$ = signal<DetailedAthlete | null>(null);

  constructor() {}

  title = 'MotionMuse';
}
