import { TestBed } from '@angular/core/testing';

import { DateTime } from 'luxon';
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
});
