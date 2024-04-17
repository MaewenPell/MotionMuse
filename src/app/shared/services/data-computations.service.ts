import { Injectable, inject } from '@angular/core';
import { groupBy, map, mapValues, sumBy } from 'lodash-es';
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

    let extractedData = this.extractInformations(
      activitiesInRange,
      includedActivities
    );

    if (startedAfter) {
      extractedData = this.utilsService.fillWeeklyMissingData(
        extractedData,
        startedAfter
      );
    }

    return extractedData;
  }

  private extractInformations(
    activities: Partial<SummaryActivity>[],
    activitiesTypes: ActivityType[]
  ): WeeklyInformations {
    const extractedData: WeeklyInformations = {
      totalDistance: 0,
      totalElevation: 0,
      endDate: DateTime.now(),
      startDate: DateTime.now(),
      weekNumber: DateTime.now().weekNumber,
      totalTime: 0,
      detail: [],
      lastActivity: null,
    };

    activities.forEach(activity => {
      if (activity.type && activitiesTypes.includes(activity.type)) {
        extractedData.totalDistance += activity.distance || 0;
        extractedData.totalElevation += activity.total_elevation_gain || 0;
        extractedData.totalTime += activity.moving_time || 0;
        extractedData.detail.push({
          day: DateTime.fromISO(activity.start_date_local || ''),
          distance: activity.distance || 0,
          elevation: activity.total_elevation_gain || 0,
          timeInSeconds: activity.moving_time || 0,
          weekNumber: DateTime.fromISO(activity.start_date_local || '')
            .weekNumber,
        });
      }
    });

    return extractedData;
  }

  public getLastActivity(
    activities: SummaryActivity[],
    includedActivities: ActivityType[]
  ) {
    return activities
      .filter(activity => includedActivities.includes(activity.type))
      .reduce((previous, current) => {
        if (previous?.start_date && current?.start_date) {
          return previous.start_date > current.start_date ? previous : current;
        } else {
          return previous;
        }
      });
  }

  public extractTotalInformationPerWeek(activities: WeeklyInformations) {
    const activitiesByWeekNumber = groupBy(activities.detail, 'weekNumber');

    const sumByWeek = mapValues(activitiesByWeekNumber, sumWeek =>
      sumBy(sumWeek, 'distance')
    );

    const sumByWeekElevation = mapValues(activitiesByWeekNumber, sumWeek =>
      sumBy(sumWeek, 'elevation')
    );

    return map(sumByWeek, (value, key) => ({
      startDate: activities.detail
        .find(detail => detail.weekNumber === parseInt(key))
        ?.day.startOf('week')
        .toJSDate(),
      weekNumber: key,
      totalDistance: Math.round(value / 1000),
      totalElevation: Math.round(sumByWeekElevation[key]),
    }));
  }
}
