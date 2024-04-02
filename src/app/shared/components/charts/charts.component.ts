import { Component, InputSignal, inject, input } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { AgChartsAngular } from 'ag-charts-angular';
import { AgChartOptions } from 'ag-charts-community';
import { groupBy } from 'lodash-es';
import { DateTime } from 'luxon';
import { WeeklyInformations } from 'src/app/types/strava-extracted-informations.type';
import { SummaryActivity } from 'src/app/types/strava/types/summary-activity';
import { DataComputationsService } from '../../services/data-computations.service';

@Component({
  selector: 'app-charts',
  standalone: true,
  imports: [AgChartsAngular],
  templateUrl: './charts.component.html',
  styleUrl: './charts.component.scss',
})
export class ChartsComponent {
  private values!: WeeklyInformations;

  public chartOptions!: AgChartOptions;
  public chartOptionsWeeklyEvolutions!: AgChartOptions;

  public activities$: InputSignal<SummaryActivity[]> =
    input.required<SummaryActivity[]>();

  public yearActivities$: InputSignal<SummaryActivity[]> =
    input.required<SummaryActivity[]>();

  private dataComputationService: DataComputationsService = inject(
    DataComputationsService
  );

  private react = toObservable(this.activities$).subscribe(rawActivities => {
    if (rawActivities && rawActivities.length > 0) {
      this.values = this.dataComputationService.extractTotalInformations(
        rawActivities,
        'currentWeek',
        ['Run', 'TrailRun']
      );

      this.computeWeeklyChart(this.values.detail);
    }
  });

  private reactYear = toObservable(this.yearActivities$).subscribe(
    rawYearActivities => {
      if (rawYearActivities && rawYearActivities.length > 0) {
        this.values = this.dataComputationService.extractTotalInformations(
          rawYearActivities,
          'custom',
          ['Run', 'TrailRun'],
          DateTime.now().startOf('year'),
          DateTime.now().endOf('year')
        );

        this.computeAllWeeksEvolutionsChart(this.values.detail);
      }
    }
  );

  private computeWeeklyChart(activities: WeeklyInformations['detail']) {
    const data = activities.map(activity => ({
      days: DateTime.fromISO(activity.day).toJSDate(),
      distance: activity.distance ? activity.distance / 1000 : null,
      elevation: activity.elevation ? activity.elevation : null,
    }));

    this.chartOptions = {
      data: data,
      title: { text: 'Current Week' },
      axes: [
        {
          position: 'left',
          type: 'number',
          title: { text: 'Distance (Km)' },
          max: 100,
          min: 0,
          keys: ['distance'],
        },
        {
          position: 'right',
          type: 'number',
          title: { text: 'Elevation (m)' },
          max: 2000,
          min: 0,
          keys: ['elevation'],
        },
        { position: 'bottom', type: 'time', title: { text: 'Days' } },
      ],
      series: [
        {
          type: 'line',
          xKey: 'days',
          yKey: 'distance',
          tooltip: {
            renderer: function ({ datum, yKey }) {
              return {
                content: datum[yKey].toFixed(0) + 'Km',
                title: 'Distance',
              };
            },
          },
        },
        {
          type: 'line',
          xKey: 'days',
          yKey: 'elevation',
          tooltip: {
            renderer: function ({ datum, xKey, yKey }) {
              return {
                content: datum[yKey].toFixed(0) + 'm',
                title: 'Elevation',
              };
            },
          },
        },
      ],
    };
  }

  private computeAllWeeksEvolutionsChart(
    activities: WeeklyInformations['detail']
  ) {
    const data = activities.map(activity => ({
      days: DateTime.fromISO(activity.day).toJSDate(),
      distance: activity.distance ? activity.distance / 1000 : null,
      elevation: activity.elevation ? activity.elevation : null,
      weekNumber: DateTime.fromISO(activity.day).weekNumber,
    }));

    const res = groupBy(data, 'weekNumber');

    const sumDistancePerWeek = Object.entries(res).reduce<{
      [key: string]: number;
    }>((acc, [weekNumber, activities]) => {
      const totalDistance = activities.reduce(
        (sum, activity) => sum + (activity.distance || 0),
        0
      );
      acc[weekNumber] = Math.round(totalDistance);
      return acc;
    }, {});

    const sumDistancePerWeekArray = Object.entries(sumDistancePerWeek).map(
      ([weekNumber, totalDistance]) => {
        const year = DateTime.now().year;
        const startDate = DateTime.fromObject({
          weekNumber: parseInt(weekNumber),
          weekYear: year,
        }).startOf('week');

        return {
          weekNumber: parseInt(weekNumber),
          totalDistance,
          startDate: startDate.toJSDate(),
        };
      }
    );

    this.chartOptionsWeeklyEvolutions = {
      data: sumDistancePerWeekArray,
      title: { text: 'Weekly Distance Evolution' },
      axes: [
        {
          position: 'left',
          type: 'number',
          title: { text: 'Distance (Km)' },
          max: 100,
          min: 0,
          keys: ['totalDistance'],
        },
        { position: 'bottom', type: 'time', title: { text: 'Weeks' } },
      ],
      series: [
        {
          type: 'line',
          xKey: 'startDate',
          yKey: 'totalDistance',
          tooltip: {
            renderer: function ({ datum, yKey }) {
              return {
                content: datum[yKey].toFixed(0) + 'Km',
                title: 'Distance',
              };
            },
          },
        },
      ],
    };

    return sumDistancePerWeek;
  }
}
