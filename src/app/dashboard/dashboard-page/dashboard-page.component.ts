import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DateTime } from 'luxon';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { CardComponent } from 'src/app/shared/components/card/card.component';
import { ChartsComponent } from 'src/app/shared/components/charts/charts.component';
import { LastActivityCardComponent } from 'src/app/shared/components/last-activity-card/last-activity-card.component';
import { CardService } from 'src/app/shared/services/card.service';
import { ConnectionService } from 'src/app/shared/services/connection.service';
import { DataComputationsService } from 'src/app/shared/services/data-computations.service';
import { StravaService } from 'src/app/shared/services/strava.service';
import { WeeklyInformations } from 'src/app/types/strava-extracted-informations.type';
import { SummaryActivity } from 'src/app/types/strava/types/summary-activity';

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ToastModule,
    CardComponent,
    ButtonModule,
    ChartsComponent,
    LastActivityCardComponent,
  ],
  providers: [MessageService, StravaService],
})
export class DashboardPageComponent {
  //#region DI
  public connectionService = inject(ConnectionService);
  public dataComputationsService = inject(DataComputationsService);
  public stravaService = inject(StravaService);
  public cardService = inject(CardService);
  //#endregion

  //#region signals
  public yearsActivitiesPerWeek = signal<WeeklyInformations>({
    startDate: DateTime.now(),
    endDate: DateTime.now(),
    totalDistance: 0,
    totalElevation: 0,
    totalTime: 0,
    detail: [],
  });
  public lastActivity$ = signal<SummaryActivity>({
    id: 0,
    utc_offset: 0,
    external_id: '',
    upload_id: 0,
    athlete: {
      id: 0,
      resource_state: 0,
    },
    name: '',
    distance: 0,
    moving_time: 0,
    elapsed_time: 0,
    total_elevation_gain: 0,
    location_city: null,
    location_state: null,
    location_country: null,
    average_heartrate: 0,
    max_heartrate: 0,
    heartrate_opt_out: false,
    display_hide_heartrate_option: false,
    average_temp: 0,
    from_accepted_tag: false,
    has_heartrate: false,
    pr_count: 0,
    elev_high: 0,
    suffer_score: 0,
    elev_low: 0,
    visibility: '',
    type: '',
    sport_type: '',
    start_date: '',
    start_date_local: '',
    timezone: '',
    start_latlng: [],
    end_latlng: [],
    achievement_count: 0,
    kudos_count: 0,
    comment_count: 0,
    athlete_count: 0,
    photo_count: 0,
    total_photo_count: 0,
    map: {
      id: '',
      polyline: undefined,
      summary_polyline: '',
    },
    trainer: false,
    commute: false,
    manual: false,
    private: false,
    flagged: false,
    upload_id_str: '',
    average_speed: 0,
    max_speed: 0,
    has_kudoed: false,
    gear_id: null,
  });
  //#endregion

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
            ['Run', 'TrailRun', 'Ride', 'BackcountrySki', 'NordicSki'],
            startOfYear,
            endOfYear
          );

        this.lastActivity$.set(activities[0]);

        this.yearsActivitiesPerWeek.set(yearsActivityPerWeeks);
      });
  }
}
