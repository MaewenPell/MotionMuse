import { TestBed } from '@angular/core/testing';
import { DateTime } from 'luxon';

import { SummaryActivity } from 'src/app/types/strava/types/summary-activity';
import { DataComputationsService } from './data-computations.service';

fdescribe('DataComputationsService', () => {
  let service: DataComputationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataComputationsService);
  });

  it('[getTotaRunninglDistance] should calculate total running distance for the current week', () => {
    const dynamicStartDate = DateTime.now().startOf('week');
    const dynamicEndDate = DateTime.now().endOf('week');

    const outOfRangeStartDate = dynamicEndDate.plus({ day: 1 }).toJSDate();

    const inRangeStartDate = dynamicEndDate.minus({ day: 1 }).toJSDate();
    const inRangeStartDate2 = dynamicStartDate.plus({ days: 1 }).toJSDate();

    const activities: Partial<SummaryActivity>[] = [
      { type: 'Run', distance: 5, start_date: inRangeStartDate },
      { type: 'TrailRun', distance: 10, start_date: outOfRangeStartDate },
      { type: 'Run', distance: 7, start_date: inRangeStartDate2 },
      { type: 'BackcountrySki', distance: 7, start_date: inRangeStartDate2 },
      { type: 'TrailRun', distance: 3, start_date: inRangeStartDate },
    ];
    const totalDistance = service.getTotaRunninglDistance(
      activities,
      'currentWeek'
    );

    // Only the distances of the correct sport + dates are considered
    expect(totalDistance).toBe(5 + 7 + 3);
  });

  it('[getTotaRunninglDistance] should calculate total running distance for the current month', () => {
    const dynamicStartDate = DateTime.now().startOf('month');
    const dynamicEndDate = DateTime.now().endOf('month');

    const outOfRangeStartDate = dynamicEndDate.plus({ week: 2 }).toJSDate();

    const inRangeStartDate = dynamicEndDate.minus({ days: 1 }).toJSDate();
    const inRangeStartDate2 = dynamicStartDate.plus({ days: 1 }).toJSDate();

    const activities: Partial<SummaryActivity>[] = [
      { type: 'Run', distance: 5, start_date: inRangeStartDate },
      { type: 'Run', distance: 10, start_date: inRangeStartDate },
      { type: 'Run', distance: 7, start_date: outOfRangeStartDate },
      { type: 'BackcountrySki', distance: 7, start_date: inRangeStartDate2 },
      { type: 'TrailRun', distance: 3, start_date: outOfRangeStartDate },
    ];
    const totalDistance = service.getTotaRunninglDistance(
      activities,
      'currentMonth'
    );
    expect(totalDistance).toBe(5 + 10);
  });

  it('should calculate total running distance for a custom range', () => {
    const dynamicStartDate = DateTime.now().minus({ days: 3 });
    const dynamicEndDate = DateTime.now().plus({ days: 3 });

    const inRangeStartDate = dynamicEndDate.minus({ days: 1 }).toJSDate();
    const inRangeStartDate2 = dynamicStartDate.plus({ days: 1 }).toJSDate();

    const outOfRangeStartDate = dynamicEndDate.plus({ day: 1 }).toJSDate();

    const activities: Partial<SummaryActivity>[] = [
      { type: 'Run', distance: 5, start_date: inRangeStartDate },
      { type: 'TrailRun', distance: 10, start_date: outOfRangeStartDate },
      { type: 'Run', distance: 7, start_date: inRangeStartDate2 },
      { type: 'TrailRun', distance: 3, start_date: inRangeStartDate },
      { type: 'BackcountrySki', distance: 7, start_date: inRangeStartDate2 },
    ];

    const totalDistance = service.getTotaRunninglDistance(
      activities,
      'custom',
      dynamicStartDate,
      dynamicEndDate
    );
    expect(totalDistance).toBe(5 + 7 + 3);
  });

  it('should throw an error for custom range without valid dates', () => {
    const activities: Partial<SummaryActivity>[] = [
      { type: 'Run', distance: 5 },
      { type: 'TrailRun', distance: 10 },
      { type: 'Run', distance: 7 },
      { type: 'TrailRun', distance: 3 },
    ];
    const startedAfter = undefined;
    const before = undefined;
    expect(() => {
      service.getTotaRunninglDistance(
        activities,
        'custom',
        startedAfter,
        before
      );
    }).toThrowError('You must provide a valid date for the custom range');
  });
});
