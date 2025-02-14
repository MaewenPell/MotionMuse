import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { stravaAuthGuard } from './strava-auth.guard';

describe('stravaAuthGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => stravaAuthGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
