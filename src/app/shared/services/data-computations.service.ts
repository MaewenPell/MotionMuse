import { Injectable } from '@angular/core';
import { DateTime } from 'luxon';
import { WeeklyInformations } from 'src/app/types/strava-extracted-informations.type';
import { SummaryActivity } from 'src/app/types/strava/types/summary-activity';

@Injectable({
  providedIn: 'root',
})
export class DataComputationsService {
  public extractStravaInformation(
    activities: SummaryActivity[] | Partial<SummaryActivity>[],
    from: 'currentWeek' | 'currentMonth' | 'custom',
    informationType: Array<keyof SummaryActivity>,
    includedActivities: SummaryActivity['type'][],
    startedAfter?: DateTime,
    before?: DateTime
  ): WeeklyInformations {
    const extractedData = {
      totalDistance: 0,
      totalElevation: 0,
      totalTime: 0,
    };

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

    informationType.forEach((type: keyof SummaryActivity) => {
      switch (type) {
        case 'distance':
          extractedData.totalDistance = this.extractDistance(
            activitiesInRange,
            includedActivities
          );
          break;
        case 'elev_high':
          extractedData.totalElevation = this.extractElevation(
            activitiesInRange,
            includedActivities
          );
          break;
        case 'moving_time':
          extractedData.totalTime = this.extractTime(
            activitiesInRange,
            includedActivities
          );
          break;
      }
    });

    return extractedData;
  }

  private extractTime(
    activities: Partial<SummaryActivity>[],
    includedActivities: SummaryActivity['type'][]
  ) {
    const totalTime = activities.reduce((time, activity) => {
      if (activity.type && includedActivities.includes(activity.type)) {
        if (activity.moving_time) {
          return time + activity.moving_time;
        } else {
          throw new Error('The activity must have a moving time');
        }
      }
      return time;
    }, 0);
    return totalTime;
  }

  private extractDistance(
    activities: Partial<SummaryActivity>[],
    includedActivities: SummaryActivity['type'][]
  ) {
    const totalDistance = activities.reduce((distance, activity) => {
      if (activity.type && includedActivities.includes(activity.type)) {
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

  private extractElevation(
    activities: Partial<SummaryActivity>[],
    includedActivities: SummaryActivity['type'][]
  ) {
    const totalElevation = activities.reduce((elevation, activity) => {
      if (activity.type && includedActivities.includes(activity.type)) {
        if (activity.elev_high) {
          return elevation + activity.elev_high;
        } else {
          throw new Error('The activity must have a distance');
        }
      }
      return elevation;
    }, 0);

    return totalElevation;
  }

  public getLastActivity(activities: SummaryActivity[]) {
    const lastActivity = activities.reduce((previous, current) => {
      return previous.start_date > current.start_date ? previous : current;
    });

    return lastActivity;
  }
}
