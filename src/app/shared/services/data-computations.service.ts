import { Injectable, inject } from '@angular/core';
import { DateTime } from 'luxon';
import { SummaryActivity } from 'src/app/types/strava/types/summary-activity';
import { StravaService } from './strava.service';

@Injectable({
  providedIn: 'root',
})
export class DataComputationsService {
  private stravaService = inject(StravaService);

  public shouldInitDashboardActivities() {
    // By default now we get 2 weeks of data so we can comprate the evolution
    const after = DateTime.now().startOf('week').minus({ week: 1 });
    const before = DateTime.now().endOf('week');
    this.stravaService.getActivities(before, after);
  }

  public getTotaRunningDistance(
    activities: SummaryActivity[] | Partial<SummaryActivity>[],
    from: 'currentWeek' | 'currentMonth' | 'custom',
    inludedActivities: SummaryActivity['type'][],
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

    const activitiesInRange = activities.filter(activity => {
      if (activity.start_date && startedAfter && before) {
        const activityDate = DateTime.fromISO(activity.start_date);
        return activityDate >= startedAfter && activityDate <= before;
      }
      return false;
    });

    const totalDistance = activitiesInRange.reduce((distance, activity) => {
      if (activity.type && inludedActivities.includes(activity.type)) {
        if (activity.distance) {
          return distance + activity.distance;
        } else {
          throw new Error('The activity must have a distance');
        }
      }
      return distance;
    }, 0);

    return totalDistance;
  }
}
