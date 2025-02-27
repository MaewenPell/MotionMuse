import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DateTime } from 'luxon';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { CardComponent } from 'src/app/shared/components/card/card.component';
import { ChartsComponent } from 'src/app/shared/components/charts/charts.component';
import { CardService } from 'src/app/shared/services/card.service';
import { ConnectionService } from 'src/app/shared/services/connection.service';
import { DataComputationsService } from 'src/app/shared/services/data-computations.service';
import { StravaService } from 'src/app/shared/services/strava.service';
import { CardTypesEnum } from 'src/app/types/enums/cardTypes.enum';
import { WeeklyInformations } from 'src/app/types/strava-extracted-informations.type';
import { MenuComponent } from '../../shared/components/menu/menu.component';

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.scss'],
  standalone: true,
  imports: [
    MenuComponent,
    CommonModule,
    // ConnectionComponent,
    ToastModule,
    CardComponent,
    ButtonModule,
    ChartsComponent,
  ],
  providers: [MessageService, StravaService],
})
export class DashboardPageComponent {
  public connectionService = inject(ConnectionService);
  public dataComputationsService = inject(DataComputationsService);
  public stravaService = inject(StravaService);
  public cardService = inject(CardService);

  public cardTypesEnums = CardTypesEnum;

  public yearsActivitiesPerWeek = signal<WeeklyInformations>({
    startDate: DateTime.now(),
    endDate: DateTime.now(),
    totalDistance: 0,
    totalElevation: 0,
    totalTime: 0,
    detail: [],
    lastActivity: null,
  });

  constructor() {
    const startOfYear = DateTime.now().startOf('year');
    const endOfYear = DateTime.now().endOf('year');

    this.stravaService
      .getActivities(endOfYear, startOfYear)
      .pipe(takeUntilDestroyed())
      .subscribe(activities => {
        const yearsActivityPerWeeks =
          this.dataComputationsService.extractTotalInformations(
            activities,
            'custom',
            ['Run', 'TrailRun'],
            startOfYear,
            endOfYear
          );

        this.yearsActivitiesPerWeek.set(yearsActivityPerWeeks);
      });
  }
}
