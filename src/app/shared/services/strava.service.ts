import { HttpClient } from '@angular/common/http';
import { Injectable, WritableSignal, inject, signal } from '@angular/core';
import { DateTime } from 'luxon';
import { SummaryActivity } from 'src/app/types/strava/types/summary-activity';

@Injectable({
  providedIn: 'root',
})
export class StravaService {
  private strava_base_url = 'https://www.strava.com/api/v3/athlete';
  private http = inject(HttpClient);

  public activities$: WritableSignal<SummaryActivity[]> = signal([]);
  public isLoading$: WritableSignal<boolean> = signal(false);

  getActivities(before: DateTime, after: DateTime) {
    this.isLoading$.set(true);

    const beforeInEpoch = before.toSeconds();
    const afterInEpoch = after.toSeconds();
    console.log('call');
    this.http
      .get<SummaryActivity[]>(`${this.strava_base_url}/activities`, {
        params: {
          before: beforeInEpoch,
          after: afterInEpoch,
        },
      })
      .subscribe(activities => {
        this.activities$.set(activities);
        this.isLoading$.set(false);
      });
  }
}
