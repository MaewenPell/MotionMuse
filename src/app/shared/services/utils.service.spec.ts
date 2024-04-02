import { TestBed } from '@angular/core/testing';

import { DateTime } from 'luxon';
import { WeeklyInformations } from 'src/app/types/strava-extracted-informations.type';
import { UtilsService } from './utils.service';

describe('UtilsService', () => {
  let service: UtilsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UtilsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return true if the token is still available', () => {
    const nowInSeconds = DateTime.now().toSeconds();
    const nowInSecondsPlusTwoHour = nowInSeconds + 7200;

    expect(service.isTokenStillAvailable(nowInSecondsPlusTwoHour)).toBeTrue();
  });

  it('should return false if the token is still available', () => {
    const nowInSeconds = DateTime.now().toSeconds();
    const nowInSecondsLessThanOneHour = nowInSeconds + 3599;

    expect(
      service.isTokenStillAvailable(nowInSecondsLessThanOneHour)
    ).toBeFalse();
  });

  it('should fill in missing days in the detail array', () => {
    const weeklyInfo: WeeklyInformations = {
      totalDistance: 100,
      totalElevation: 200,
      totalTime: 300,
      detail: [
        {
          day: DateTime.now().startOf('week').plus({ days: 1 }).toISODate(),
          distance: 10,
          elevation: 20,
          timeInSeconds: 30,
        },
        {
          day: DateTime.now().startOf('week').plus({ days: 3 }).toISODate(),
          distance: 40,
          elevation: 50,
          timeInSeconds: 60,
        },
      ],
      lastActivity: null,
    };

    const filledWeeklyInfo = service.fillMissingData(weeklyInfo);

    expect(filledWeeklyInfo.detail.length).toEqual(7);
  });
});
