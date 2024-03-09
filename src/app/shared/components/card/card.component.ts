import { CommonModule } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { SkeletonModule } from 'primeng/skeleton';
import { CardDataInformations } from 'src/app/types/data-card.type';
import {
  StravaExtractedInformations,
  WeeklyInformations,
} from 'src/app/types/strava-extracted-informations.type';
import { SummaryActivity } from 'src/app/types/strava/types/summary-activity';
import { APP_COLORS } from 'src/styles/_colorVariables';
import { ConvertUnitPipe } from '../../pipes/convert-unit.pipe';
import { ToIconPipe } from '../../pipes/to-icon.pipe';
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
    ToIconPipe,
    SkeletonModule,
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

  private react = toObservable(this.activities$).subscribe(rawActivities => {
    if (rawActivities && rawActivities.length > 0) {
      this.weeklyInformations =
        this.cardService.computeWeeklyInformations(rawActivities);

      this.weeklyDistanceCard = this.createWeeklyDistanceCard(
        this.weeklyInformations.currentWeek,
        this.weeklyInformations.lastWeek
      );

      this.weeklyElevationGainCard = this.createWeeklyElevationCard(
        this.weeklyInformations.currentWeek,
        this.weeklyInformations.lastWeek
      );

      this.cards.push(this.weeklyDistanceCard, this.weeklyElevationGainCard);
    }
  });

  private createWeeklyDistanceCard(
    currentWeek: WeeklyInformations,
    lastWeek: WeeklyInformations
  ): CardDataInformations {
    return {
      title: 'Weekly distance',
      mainValue: currentWeek.totalDistance,
      mainValueUnit: 'km',
      evolutionValueKm: currentWeek.totalDistance - lastWeek.totalDistance,
      evolutionSentence: 'from last week',
    };
  }

  private createWeeklyElevationCard(
    currentWeek: WeeklyInformations,
    lastWeek: WeeklyInformations
  ): CardDataInformations {
    return {
      title: 'Weekly elevation',
      mainValue: currentWeek.totalElevation,
      mainValueUnit: 'm',
      evolutionValueKm: currentWeek.totalElevation - lastWeek.totalElevation,
      evolutionSentence: 'from last week',
    };
  }
}
