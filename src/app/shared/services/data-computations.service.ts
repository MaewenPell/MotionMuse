import { Injectable, inject } from '@angular/core';
import { DateTime } from 'luxon';
import { WeeklyInformations } from 'src/app/types/strava-extracted-informations.type';
import { ActivityType } from 'src/app/types/strava/enum/activity-type.enum';
import { SummaryActivity } from 'src/app/types/strava/types/summary-activity';
import { UtilsService } from './utils.service';

@Injectable({
  providedIn: 'root',
})
export class DataComputationsService {
  private utilsService: UtilsService = inject(UtilsService);

  public extractTotalInformations(
    activities: SummaryActivity[] | Partial<SummaryActivity>[],
    from: 'currentWeek' | 'currentMonth' | 'custom',
    includedActivities: SummaryActivity['type'][],
    startedAfter?: DateTime,
    before?: DateTime
  ): WeeklyInformations {
    switch (from) {
      case 'currentWeek':
        startedAfter = DateTime.local().startOf('week');
        before = DateTime.local().endOf('week');
        break;
      case 'currentMonth':
        startedAfter = DateTime.local().startOf('month');
        before = DateTime.local().endOf('month');
        break;
      case 'custom':
        if (!startedAfter || !before) {
          throw new Error('You must provide a valid date for the custom range');
        }
    }

    const activitiesInRange = activities.filter(activity => {
      if (activity.start_date && startedAfter && before) {
        const activityDate = DateTime.fromISO(activity.start_date);
        return activityDate >= startedAfter && activityDate <= before;
      }
      return false;
    });

    const extractedData = this.extractInformations(
      activitiesInRange,
      includedActivities
    );

    return extractedData;
  }

  private extractInformations(
    activities: Partial<SummaryActivity>[],
    activitiesTypes: ActivityType[]
  ): WeeklyInformations {
    const extractedData: WeeklyInformations = {
      totalDistance: 0,
      totalElevation: 0,
      totalTime: 0,
      detail: [],
      lastActivity: null,
    };

    activities.forEach(activity => {
      if (activity.type && activitiesTypes.includes(activity.type)) {
        extractedData.totalDistance += activity.distance || 0;
        extractedData.totalElevation += activity.elev_high || 0;
        extractedData.totalTime += activity.moving_time || 0;
        extractedData.detail.push({
          day:
            DateTime.fromISO(activity.start_date_local || '').toISODate() || '',
          distance: activity.distance || 0,
          elevation: activity.elev_high || 0,
          timeInSeconds: activity.moving_time || 0,
        });
      }
    });

    this.utilsService.fillMissingData(extractedData);

    return extractedData;
  }

  public getLastActivity(activities: SummaryActivity[]) {
    const lastActivity = activities.reduce((previous, current) => {
      if (previous?.start_date && current?.start_date) {
        return previous.start_date > current.start_date ? previous : current;
      } else {
        return previous;
      }
    });

    return lastActivity;
  }
}
