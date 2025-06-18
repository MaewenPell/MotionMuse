import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { apiGuard } from './api.guard';

describe('apiGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => apiGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
