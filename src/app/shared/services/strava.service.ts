import { HttpClient } from '@angular/common/http';
import { Injectable, WritableSignal, inject, signal } from '@angular/core';
import { DateTime } from 'luxon';
import { MessageService } from "primeng/api";
import { Observable, tap } from 'rxjs';
import { SummaryActivity } from 'src/app/types/strava/types/summary-activity';

@Injectable({
  providedIn: 'root',
})
export class StravaService {
  private strava_base_url = 'https://www.strava.com/api/v3/athlete';
  // private strava_base_url = 'localhost';
  private http = inject(HttpClient);
  private messageService = inject(MessageService);

  public activities$: WritableSignal<SummaryActivity[]> = signal([]);
  public isLoading$: WritableSignal<boolean> = signal(false);

  getActivities(
    before: DateTime,
    after: DateTime
  ): Observable<SummaryActivity[]> {
    this.isLoading$.set(true);

    const beforeInEpoch = before.toSeconds();
    const afterInEpoch = after.toSeconds();

    return this.http
      .get<SummaryActivity[]>(`${this.strava_base_url}/activities`, {
        params: {
          before: beforeInEpoch,
          after: afterInEpoch,
          per_page: 100,
        },
      })
      .pipe(
        tap({
          next: event => {
            console.log(event);
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Activities loaded',
            });
          },
          error: error => {
            this.isLoading$.set(false);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: `Activities not loaded ${error}`,
            });
          },
          complete: () => this.isLoading$.set(false),
        })
      );
  }
}
