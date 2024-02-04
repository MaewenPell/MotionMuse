import { TestBed } from '@angular/core/testing';

import { DataComputationsService } from './data-computations.service';

describe('DataComputationsService', () => {
  let service: DataComputationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataComputationsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
