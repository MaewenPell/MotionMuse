import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { DateTime } from 'luxon';
import { Observable } from 'rxjs';
import { SummaryActivity } from 'src/app/types/strava/types/summary-activity';

@Injectable({
  providedIn: 'root',
})
export class StravaService {
  private strava_base_url = 'https://www.strava.com/api/v3/athlete';
  private http = inject(HttpClient);

  getActivities(
    before: DateTime,
    after: DateTime
  ): Observable<SummaryActivity[]> {
    const beforeInEpoch = before.toSeconds();
    const afterInEpoch = after.toSeconds();
    const observable = this.http.get<SummaryActivity[]>(
      `${this.strava_base_url}/activities`,
      {
        params: {
          before: beforeInEpoch,
          after: afterInEpoch,
        },
      }
    );

    return observable;
  }
}
