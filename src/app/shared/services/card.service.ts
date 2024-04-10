import { Injectable, inject } from '@angular/core';
import { DateTime } from 'luxon';
import { PrimeIcons } from 'primeng/api';
import { CardDataInformations } from 'src/app/types/data-card.type';
import {
  StravaExtractedInformations,
  WeeklyInformations,
} from 'src/app/types/strava-extracted-informations.type';
import { SummaryActivity } from 'src/app/types/strava/types/summary-activity';
import { APP_COLORS } from 'src/styles/_colorVariables';
import { DataComputationsService } from './data-computations.service';

@Injectable({
  providedIn: 'root',
})
export class CardService {
  private dataComputationsService = inject(DataComputationsService);
  private primeIcon = PrimeIcons;

  public computeWeeklyInformations(
    activites: SummaryActivity[]
  ): StravaExtractedInformations {
    {
      const currentWeekStartDate = DateTime.now().startOf('week');
      const currentWeekEndDate = DateTime.now().endOf('week');
      const lastWeekStartDate = DateTime.now()
        .startOf('week')
        .minus({ weeks: 1 });
      const lastWeekEndDate = DateTime.now().endOf('week').minus({ weeks: 1 });

      const currentWeek = this.dataComputationsService.extractTotalInformations(
        activites,
        'currentWeek',
        ['Run', 'TrailRun'],
        currentWeekStartDate,
        currentWeekEndDate
      );

      const lastWeek = this.dataComputationsService.extractTotalInformations(
        activites,
        'custom',
        ['Run', 'TrailRun'],
        lastWeekStartDate,
        lastWeekEndDate
      );

      return {
        lastWeek: {
          startDate: lastWeekStartDate,
          endDate: lastWeekEndDate,
          weekNumber: lastWeek.weekNumber,
          totalDistance: lastWeek.totalDistance,
          totalElevation: lastWeek.totalElevation,
          totalTime: lastWeek.totalTime,
          detail: lastWeek.detail,
          lastActivity: lastWeek.lastActivity,
        },
        currentWeek: {
          startDate: currentWeekStartDate,
          endDate: currentWeekEndDate,
          weekNumber: currentWeek.weekNumber,
          totalDistance: currentWeek.totalDistance,
          totalElevation: currentWeek.totalElevation,
          totalTime: currentWeek.totalTime,
          detail: currentWeek.detail,
          lastActivity: lastWeek.lastActivity,
        },
      };
    }
  }

  public createWeeklyTimeSpendCard(
    currentWeek: WeeklyInformations,
    lastWeek: WeeklyInformations
  ): CardDataInformations {
    return {
      title: 'Time',
      icon: 'time',
      isPrimeIcon: true,
      mainValue: currentWeek.totalTime,
      mainValueUnit: 'h',
      evolutionIcon:
        currentWeek.totalTime - lastWeek.totalTime > 0
          ? this.primeIcon.ARROW_UP
          : this.primeIcon.ARROW_DOWN,
      evolutionValue: currentWeek.totalTime - lastWeek.totalTime,
      evolutionColor:
        currentWeek.totalTime - lastWeek.totalTime > 0
          ? APP_COLORS.GREEN
          : APP_COLORS.LIGHT_RED,
      evolutionUnit: 'h',
      evolutionSentence: 'since last week',
      color: APP_COLORS.ORANGE,
    };
  }

  public createWeeklyDistanceCard(
    currentWeek: WeeklyInformations,
    lastWeek: WeeklyInformations
  ): CardDataInformations {
    return {
      title: 'Distance',
      icon: 'running',
      isPrimeIcon: false,
      mainValue: currentWeek.totalDistance,
      mainValueUnit: 'km',
      evolutionIcon:
        currentWeek.totalDistance - lastWeek.totalDistance > 0
          ? this.primeIcon.ARROW_UP
          : this.primeIcon.ARROW_DOWN,
      evolutionValue: currentWeek.totalDistance - lastWeek.totalDistance,
      evolutionColor:
        currentWeek.totalDistance - lastWeek.totalDistance > 0
          ? APP_COLORS.GREEN
          : APP_COLORS.LIGHT_RED,
      evolutionUnit: 'km',
      evolutionSentence: 'since last week',
      color: APP_COLORS.YELLOW,
    };
  }

  public createWeeklyElevationCard(
    currentWeek: WeeklyInformations,
    lastWeek: WeeklyInformations
  ): CardDataInformations {
    return {
      title: 'Elevation',
      icon: 'mountains',
      isPrimeIcon: false,
      mainValue: currentWeek.totalElevation,
      mainValueUnit: 'm',
      evolutionValue: currentWeek.totalElevation - lastWeek.totalElevation,
      evolutionIcon:
        currentWeek.totalElevation - lastWeek.totalElevation > 0
          ? this.primeIcon.ARROW_UP
          : this.primeIcon.ARROW_DOWN,
      evolutionColor:
        currentWeek.totalElevation - lastWeek.totalElevation > 0
          ? APP_COLORS.GREEN
          : APP_COLORS.LIGHT_RED,
      evolutionUnit: 'm',
      evolutionSentence: 'since last week',
      color: APP_COLORS.LIGHT_BLUE,
    };
  }

  public createLastActivityCard(
    lastActivity: SummaryActivity
  ): CardDataInformations {
    return {
      title: 'Last activity',
      icon: PrimeIcons.CALENDAR,
      isPrimeIcon: true,
      mainValue: lastActivity.distance,
      mainValueUnit: 'km',
      evolutionValue: lastActivity.total_elevation_gain,
      evolutionColor: APP_COLORS.DARK,
      evolutionIcon: this.primeIcon.ARROW_UP_RIGHT,
      evolutionUnit: 'm',
      evolutionSentence: 'Elevation gain',
      color: APP_COLORS.LIGHT_RED,
    };
  }
}
