import { Component, inject, input, model, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { ChartConfiguration } from 'chart.js';
import 'chartjs-adapter-luxon';
import { DateTime } from 'luxon';
import { BaseChartDirective } from 'ng2-charts';
import { ButtonModule } from 'primeng/button';
import { WeeklyInformations } from 'src/app/types/strava-extracted-informations.type';
import { SummaryActivity } from 'src/app/types/strava/types/summary-activity';
import { DataComputationsService } from '../../services/data-computations.service';

@Component({
  selector: 'app-charts',
  standalone: true,
  imports: [ButtonModule, BaseChartDirective],
  templateUrl: './charts.component.html',
  styleUrl: './charts.component.scss',
})
export class ChartsComponent {
  private dataComputationService: DataComputationsService = inject(
    DataComputationsService
  );

  public yearActivities$ = input.required<SummaryActivity[]>();

  public weeklyChartData = signal<
    | ChartConfiguration<'line', { x: string | null; y: number | null }[]>
    | undefined
  >(undefined);

  public yearlyChartData = signal<
    | ChartConfiguration<
        'line',
        { x: string | null | undefined; y: number | null }[]
      >
    | undefined
  >(undefined);

  private weeklyValues!: WeeklyInformations;

  public startDate: DateTime = DateTime.now().startOf('week');
  public endDate: DateTime = DateTime.now().endOf('week');

  private startOfyear!: DateTime;
  private endOfYear!: DateTime;

  protected subtitleWeeklyChart$ = signal<string>('');
  protected subtitleYearlyChart$ = signal<string>('');

  protected incorrectNextWeek$ = signal<boolean>(false);

  constructor() {
    toObservable(this.yearActivities$).subscribe(activities => {
      if (activities?.length) {
        // this.weeklyValues = this.dataComputationService.extractTotalInformations(
        //   activities,
        //   'currentWeek',
        //   ['Run', 'TrailRun'],
        //   this.startDate,
        //   this.endDate
        // );

        this.computeWeeklyChart(this.weeklyValues.detail);
      }
    });
  }

  private reactYear = toObservable(this.yearActivities$).subscribe(
    rawYearActivities => {
      this.startOfyear = DateTime.now().startOf('year');
      this.endOfYear = DateTime.now().endOf('year');

      if (rawYearActivities && rawYearActivities.length > 0) {
        // this.weeklyValues = this.dataComputationService.extractTotalInformations(
        //   rawYearActivities,
        //   'custom',
        //   ['Run', 'TrailRun'],
        //   this.startOfyear,
        //   this.endOfYear
        // );

        this.computeAllWeeksEvolutionsChart(this.weeklyValues);
      }
    }
  );

  private computeWeeklyChart(activities: WeeklyInformations['detail']) {
    const data = activities.map(activity => ({
      days: activity.day.toISO(),
      weekNumber: activity.weekNumber,
      distance: activity.distance ? activity.distance / 1000 : null,
      elevation: activity.elevation ? activity.elevation : null,
    }));

    this.weeklyChartData.set({
      type: 'line',
      data: {
        datasets: [
          {
            label: 'Distance',
            data: [
              ...data.map(d => {
                return { x: d.days, y: d.distance };
              }),
            ],
            backgroundColor: 'rgba(148,159,177,0.2)',
            borderColor: 'rgba(148,159,177,1)',
            pointBackgroundColor: 'rgba(148,159,177,1)',
            pointBorderColor: '#fff',
            fill: 'origin',
          },
        ],
      },
      options: {
        scales: {
          x: {
            type: 'time',
          },
          y: {
            beginAtZero: true,
          },
        },
        elements: {
          line: {
            tension: 0.5,
          },
        },
      },
    });
  }

  private computeAllWeeksEvolutionsChart(activities: WeeklyInformations) {
    const chartInformationPerWeek =
      this.dataComputationService.extractTotalInformationPerWeek(activities);

    this.yearlyChartData.set({
      type: 'line',
      data: {
        datasets: [
          {
            label: 'Distance',
            yAxisID: "y",
            data: [
              ...chartInformationPerWeek.map(d => {
                return {
                  x: d.startDate?.toISOString() ?? null,
                  y: d.totalDistance,
                };
              }),
            ],
            backgroundColor: 'rgba(148,159,177,0.2)',
            borderColor: 'rgba(148,159,177,1)',
            pointBackgroundColor: 'rgba(148,159,177,1)',
            pointBorderColor: '#fff',
            fill: 'origin',
          },
          {
            label: 'Elevation Gain',
            yAxisID: 'y1',
            backgroundColor: 'rgba(255,0,0,0.3)',
            borderColor: 'red',
            pointBackgroundColor: 'rgba(148,159,177,1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(148,159,177,0.8)',
            fill: 'origin',
            data: [
              ...chartInformationPerWeek.map(d => {
                return {
                  x: d.startDate?.toISOString() ?? null,
                  y: d.totalElevation,
                };
              }),
            ],
          },
        ],
      },
      options: {
        scales: {
          x: {
            type: 'time',
          },
          y: {
            beginAtZero: true,
            position: 'left'
          },
          y1: {
            position: 'right',
            beginAtZero: true,
            grid: {
              color: 'rgba(255,0,0,0.3)',
            },
            ticks: {
              color: 'red',
            },
          },
        },
        elements: {
          line: {
            tension: 0.5,
          },
        },
      },
    });
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

    // this.activities$.set(lastWeekActivitites);
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

    // this.activities$.set(lastWeekActivitites);
  }
}
