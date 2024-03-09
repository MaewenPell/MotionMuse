import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MessageService } from 'primeng/api';
import { StravaService } from './strava.service';

describe('StravaService', () => {
  let service: StravaService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [MessageService],
    });
    service = TestBed.inject(StravaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
