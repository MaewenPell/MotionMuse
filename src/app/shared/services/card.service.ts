import { Injectable, inject } from '@angular/core';
import { DateTime } from 'luxon';
import { StravaExtractedInformations } from 'src/app/types/strava-extracted-informations.type';
import { SummaryActivity } from 'src/app/types/strava/types/summary-activity';
import { DataComputationsService } from './data-computations.service';

@Injectable({
  providedIn: 'root',
})
export class CardService {
  private dataComputationsService = inject(DataComputationsService);

  public computeWeeklyInformations(
    activites: SummaryActivity[]
  ): StravaExtractedInformations {
    {
      const currentWeek = this.dataComputationsService.extractStravaInformation(
        activites,
        'currentWeek',
        ['distance', 'elev_high'],
        ['Run', 'TrailRun'],
        DateTime.now().startOf('week'),
        DateTime.now().endOf('week')
      );

      const lastWeek = this.dataComputationsService.extractStravaInformation(
        activites,
        'custom',
        ['distance', 'elev_high'],
        ['Run', 'TrailRun'],
        DateTime.now().startOf('week'),
        DateTime.now().endOf('week')
      );

      return {
        lastWeek: {
          totalDistance: lastWeek.totalDistance,
          totalElevation: lastWeek.totalElevation,
        },
        currentWeek: {
          totalDistance: currentWeek.totalDistance,
          totalElevation: currentWeek.totalElevation,
        },
      };
    }
  }
}
