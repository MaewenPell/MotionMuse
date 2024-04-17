import { CommonModule } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { SkeletonModule } from 'primeng/skeleton';
import { CardDataInformations } from 'src/app/types/data-card.type';
import { StravaExtractedInformations } from 'src/app/types/strava-extracted-informations.type';
import { SummaryActivity } from 'src/app/types/strava/types/summary-activity';
import { APP_COLORS } from 'src/styles/_colorVariables';
import { ConvertUnitPipe } from '../../pipes/convert-unit.pipe';
import { ToDashboardTimePipe } from '../../pipes/to-dashboard-time.pipe';
import { toIconPipe } from '../../pipes/to-icon.pipe';
import { CardService } from '../../services/card.service';
import { DataComputationsService } from '../../services/data-computations.service';
import { StravaService } from '../../services/strava.service';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-cards',
  standalone: true,
  imports: [
    CommonModule,
    IconComponent,
    ConvertUnitPipe,
    toIconPipe,
    SkeletonModule,
    ToDashboardTimePipe,
  ],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss',
})
export class CardComponent {
  public activities$ = input.required<SummaryActivity[]>();

  public cardService = inject(CardService);
  public stravaService = inject(StravaService);
  public dataComputationsService = inject(DataComputationsService);

  public appColors = APP_COLORS;
  public cards: CardDataInformations[] = [];

  private weeklyInformations!: StravaExtractedInformations;

  private weeklyDistanceCard!: CardDataInformations;
  private weeklyElevationGainCard!: CardDataInformations;
  private weeklyTimeSpendCard!: CardDataInformations;
  private lastActivityCard!: CardDataInformations;

  private react = toObservable(this.activities$).subscribe(rawActivities => {
    if (rawActivities && rawActivities.length > 0) {
      this.weeklyInformations =
        this.cardService.computeWeeklyInformations(rawActivities);

      this.weeklyDistanceCard = this.cardService.createWeeklyDistanceCard(
        this.weeklyInformations.currentWeek,
        this.weeklyInformations.lastWeek
      );

      this.weeklyElevationGainCard = this.cardService.createWeeklyElevationCard(
        this.weeklyInformations.currentWeek,
        this.weeklyInformations.lastWeek
      );

      this.lastActivityCard = this.cardService.createLastActivityCard(
        this.dataComputationsService.getLastActivity(rawActivities, [
          'TrailRun',
          'Run',
        ])
      );

      this.weeklyTimeSpendCard = this.cardService.createWeeklyTimeSpendCard(
        this.weeklyInformations.currentWeek,
        this.weeklyInformations.lastWeek
      );

      this.cards.push(
        this.weeklyDistanceCard,
        this.weeklyElevationGainCard,
        this.weeklyTimeSpendCard,
        this.lastActivityCard
      );
    }
  });
}
