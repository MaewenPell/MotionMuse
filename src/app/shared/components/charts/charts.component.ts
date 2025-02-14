import {
  Component,
  InputSignal,
  inject,
  input,
  model,
  signal,
} from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { DateTime } from 'luxon';
import { ButtonModule } from 'primeng/button';
import { WeeklyInformations } from 'src/app/types/strava-extracted-informations.type';
import { SummaryActivity } from 'src/app/types/strava/types/summary-activity';
import { DataComputationsService } from '../../services/data-computations.service';

@Component({
  selector: 'app-charts',
  standalone: true,
  imports: [ButtonModule],
  templateUrl: './charts.component.html',
  styleUrl: './charts.component.scss',
})
export class ChartsComponent {
  private dataComputationService: DataComputationsService = inject(
    DataComputationsService
  );

  public activities$ = model<SummaryActivity[]>();

  public yearActivities$: InputSignal<SummaryActivity[]> =
    input.required<SummaryActivity[]>();

  private values!: WeeklyInformations;

  public startDate: DateTime = DateTime.now().startOf('week');
  public endDate: DateTime = DateTime.now().endOf('week');

  private startOfyear!: DateTime;
  private endOfYear!: DateTime;

  protected subtitleWeeklyChart$ = signal<string>('');
  protected subtitleYearlyChart$ = signal<string>('');

  protected incorrectNextWeek$ = signal<boolean>(false);

  private weeklyActivities = toObservable(this.activities$).subscribe(
    weeklyActivities => {
      if (weeklyActivities && weeklyActivities.length > 0) {
        this.values = this.dataComputationService.extractTotalInformations(
          this.activities$() ?? [],
          'custom',
          ['Run', 'TrailRun'],
          this.startDate,
          this.endDate
        );

        this.computeWeeklyChart(this.values.detail);
      }
    }
  );

  private reactYear = toObservable(this.yearActivities$).subscribe(
    rawYearActivities => {
      this.startOfyear = DateTime.now().startOf('year');
      this.endOfYear = DateTime.now().endOf('year');
      if (rawYearActivities && rawYearActivities.length > 0) {
        this.values = this.dataComputationService.extractTotalInformations(
          rawYearActivities,
          'custom',
          ['Run', 'TrailRun'],
          this.startOfyear,
          this.endOfYear
        );

        this.computeAllWeeksEvolutionsChart(this.values);
      }
    }
  );

  private computeWeeklyChart(activities: WeeklyInformations['detail']) {
    const expectedNextStartDate = this.startDate.plus({
      week: 1,
    });

    this.incorrectNextWeek$.set(
      expectedNextStartDate.startOf('week') > DateTime.now()
    );

    this.subtitleWeeklyChart$.set(
      `From : ${this.startDate.setLocale('en-gb').toLocaleString({ weekday: 'short', month: 'short', day: '2-digit' })} to ${this.endDate.setLocale('en-gb').toLocaleString({ weekday: 'short', month: 'short', day: '2-digit' })}`
    );

    const data = activities.map(activity => ({
      days: activity.day.toISO(),
      weekNumber: activity.weekNumber,
      distance: activity.distance ? activity.distance / 1000 : null,
      elevation: activity.elevation ? activity.elevation : null,
    }));
  }

  private computeAllWeeksEvolutionsChart(activities: WeeklyInformations) {
    this.subtitleYearlyChart$.set(
      `From : ${this.startOfyear.setLocale('en-gb').toLocaleString({ weekday: 'short', month: 'short', day: '2-digit' })} to ${this.endOfYear.setLocale('en-gb').toLocaleString({ weekday: 'short', month: 'short', day: '2-digit' })}`
    );

    const chartInformationPerWeek =
      this.dataComputationService.extractTotalInformationPerWeek(activities);
  }

  public loadPreviousWeekActivities() {
    this.startDate = this.startDate.minus({
      week: 1,
    });
    this.endDate = this.endDate
      .minus({
        week: 1,
      })
      .endOf('week');

    const lastWeekActivitites = this.yearActivities$().filter(summary => {
      return (
        DateTime.fromISO(summary.start_date) > this.startDate &&
        DateTime.fromISO(summary.start_date) < this.endDate
      );
    });

    this.activities$.set(lastWeekActivitites);
  }

  public loadNextWeekActivities() {
    const expectedStartDate = this.startDate.plus({
      week: 1,
    });

    this.startDate = expectedStartDate;
    this.endDate = this.endDate
      .plus({
        week: 1,
      })
      .endOf('week');

    const lastWeekActivitites = this.yearActivities$().filter(summary => {
      return (
        DateTime.fromISO(summary.start_date) > this.startDate &&
        DateTime.fromISO(summary.start_date) < this.endDate
      );
    });

    this.activities$.set(lastWeekActivitites);
  }
}
