import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { StravaService } from './strava.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { MessageService } from "primeng/api";

describe('StravaService', () => {
  let service: StravaService;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [],
    providers: [MessageService, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
});
    service = TestBed.inject(StravaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
