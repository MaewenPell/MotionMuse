import { TestBed } from '@angular/core/testing';
import { DateTime } from 'luxon';
import { ActivityType } from 'src/app/types/strava/enum/activity-type.enum';
import { SummaryActivity } from 'src/app/types/strava/types/summary-activity';
import { DataComputationsService } from './data-computations.service';

describe('DataComputationsService', () => {
  let service: DataComputationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataComputationsService);
  });

  it('should extract weekly informations from activities', () => {
    const activities: Partial<SummaryActivity>[] = [
      {
        type: 'Run',
        distance: 10,
        total_elevation_gain: 100,
        moving_time: 3600,
        start_date_local: DateTime.now().startOf('week').toISODate(),
      },
      {
        type: 'Ride',
        distance: 20,
        total_elevation_gain: 200,
        moving_time: 7200,
        start_date_local: DateTime.now()
          .startOf('week')
          .plus({ day: 1 })
          .toISODate(),
      },
    ];
    const activitiesTypes: ActivityType[] = ['Run', 'Ride'];

    const result = service['extractInformations'](activities, activitiesTypes);

    expect(result.totalDistance).toBe(30);
    expect(result.totalElevation).toBe(300);
    expect(result.totalTime).toBe(10800);
    expect(result.detail.length).toBe(2);
    expect(result.detail[0]).toEqual({
      day: DateTime.now().startOf('week'),
      weekNumber: DateTime.now().startOf('week').weekNumber,
      distance: 10,
      elevation: 100,
      timeInSeconds: 3600,
    });
    expect(result.detail[1]).toEqual({
      day: DateTime.now().startOf('week').plus({ day: 1 }),
      weekNumber: DateTime.now().startOf('week').weekNumber,
      distance: 20,
      elevation: 200,
      timeInSeconds: 7200,
    });
  });

  it('should not include activities with types not in activitiesTypes', () => {
    const activities: Partial<SummaryActivity>[] = [
      {
        type: 'Run',
        distance: 10,
        total_elevation_gain: 100,
        moving_time: 3600,
        start_date_local: DateTime.now().startOf('week').toISODate(),
      },
      {
        type: 'Swim',
        distance: 5,
        total_elevation_gain: 50,
        moving_time: 1800,
        start_date_local: DateTime.now()
          .startOf('week')
          .plus({ day: 1 })
          .toISODate(),
      },
    ];
    const activitiesTypes: ActivityType[] = ['Run'];

    const result = service['extractInformations'](activities, activitiesTypes);

    expect(result.totalDistance).toBe(10);
    expect(result.totalElevation).toBe(100);
    expect(result.totalTime).toBe(3600);
    expect(result.detail.length).toBe(1);
    expect(result.detail[0]).toEqual({
      day: DateTime.now().startOf('week'),
      distance: 10,
      elevation: 100,
      timeInSeconds: 3600,
      weekNumber: DateTime.now().startOf('week').weekNumber,
    });
  });

  it('should handle empty activities array', () => {
    const activities: Partial<SummaryActivity>[] = [];
    const activitiesTypes: ActivityType[] = ['Run', 'Ride'];

    const result = service['extractInformations'](activities, activitiesTypes);

    expect(result.totalDistance).toBe(0);
    expect(result.totalElevation).toBe(0);
    expect(result.totalTime).toBe(0);
    expect(result.detail.length).toBe(0);
  });
});
