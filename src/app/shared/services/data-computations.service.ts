import { Injectable } from '@angular/core';
import { DateTime } from 'luxon';
import { ActivityType } from 'src/app/types/strava/enum/activity-type.enum';
import { SummaryActivity } from 'src/app/types/strava/types/summary-activity';

@Injectable({
  providedIn: 'root',
})
export class DataComputationsService {
  public getTotaRunninglDistance(
    activities: SummaryActivity[],
    from: 'currentWeek' | 'currentMonth' | 'custom',
    startedAfter?: DateTime,
    before?: DateTime
  ): number {
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

    let totalDistance = 0;

    totalDistance = activities.reduce((distance, activity) => {
      if (
        activity.type === ActivityType.Run ||
        activity.type === ActivityType.TrailRun
      ) {
        return distance + activity.distance;
      }
      return distance;
    }, 0);

    return totalDistance;
  }
}
