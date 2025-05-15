import { HttpClient } from '@angular/common/http';
import { Injectable, WritableSignal, inject, signal } from '@angular/core';
import { DateTime } from 'luxon';
import { MessageService } from 'primeng/api';
import { Observable, of, tap } from 'rxjs';
import { DetailedAthlete } from 'src/app/types/athlete';
import { SummaryActivity } from 'src/app/types/strava/types/summary-activity';
import { ON_PREMISE_ATHLETE } from 'src/assets/onPremiseAthlele';
import { ON_PREMISE_DATA } from 'src/assets/onPremiseData';

@Injectable({
  providedIn: 'root',
})
export class StravaService {
  private strava_base_url_athlete = 'https://www.strava.com/api/v3/athlete';
  private strava_base_url = 'https://www.strava.com/api/v3';
  private http = inject(HttpClient);
  private messageService = inject(MessageService);

  public activities$: WritableSignal<SummaryActivity[]> = signal([]);
  public isLoading$: WritableSignal<boolean> = signal(false);

  private onPremise = false;

  getAthelete(): Observable<DetailedAthlete> {
    if (!this.onPremise) {
      return this.http.get<DetailedAthlete>(this.strava_base_url_athlete);
    }

    return of(ON_PREMISE_ATHLETE as DetailedAthlete);
  }

  getActivity(id: number) {
    return this.http
      .get<SummaryActivity>(
        `${this.strava_base_url}/activities/${id}?include_all_efforts=false`
      )
      .pipe(
        tap({
          next: event => {
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

  getActivities(
    before: DateTime,
    after: DateTime
  ): Observable<SummaryActivity[]> {
    this.isLoading$.set(true);

    const beforeInEpoch = before.toSeconds();
    const afterInEpoch = after.toSeconds();

    if (!this.onPremise) {
      return this.http
        .get<SummaryActivity[]>(`${this.strava_base_url_athlete}/activities`, {
          params: {
            before: beforeInEpoch,
            after: afterInEpoch,
            per_page: 100,
          },
        })
        .pipe(
          tap({
            next: event => {
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
    } else {
      return of(ON_PREMISE_DATA);
    }
  }
}
