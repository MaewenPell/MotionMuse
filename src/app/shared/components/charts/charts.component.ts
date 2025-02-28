import { Component, computed, input, Signal } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import 'chartjs-adapter-luxon';
import { DateTime } from 'luxon';
import { BaseChartDirective } from 'ng2-charts';
import { ButtonModule } from 'primeng/button';
import { WeeklyInformations } from 'src/app/types/strava-extracted-informations.type';

type ChartConfig =
  | ChartConfiguration<'bar', { x: string | null; y: number | null }[], unknown>
  | undefined;

@Component({
  selector: 'app-charts',
  standalone: true,
  imports: [ButtonModule, BaseChartDirective],
  templateUrl: './charts.component.html',
  styleUrl: './charts.component.scss',
})
export class ChartsComponent {
  public yearActivities$ = input.required<WeeklyInformations>();

  public weeklyChart$: Signal<ChartConfig> = computed(() => {
    const formattedActivityData = this.yearActivities$()
      ?.detail.filter(
        activities => activities.weekNumber === DateTime.now().weekNumber
      )
      .map(activity => ({
        days: activity.day.toISO(),
        weekNumber: activity.weekNumber,
        distance: activity.distance ? activity.distance / 1000 : null,
        elevation: activity.elevation ? activity.elevation : null,
      }));

    return {
      type: 'bar',
      data: {
        datasets: [
          {
            label: 'Distance',
            data: formattedActivityData.map(d => {
              return {
                x: d.days,
                y: d.distance,
              };
            }),
            backgroundColor: 'rgba(148,159,177,0.2)',
            borderColor: 'rgba(148,159,177,1)',
          },
        ],
      },
      options: {
        scales: {
          x: {
            type: 'time',
            time: {
              unit: 'day',
            },
            min: DateTime.now().startOf('week').toISO(),
            max: DateTime.now().endOf('week').toISO(),
          },
          y: {
            beginAtZero: true,
          },
        },
      },
    };
  });

  public monthlyChart$: Signal<ChartConfig> = computed(() => {
    const formattedActivityData = this.yearActivities$()
      ?.detail.filter(
        activities => activities.day.month === DateTime.now().month
      )

      .map(activity => ({
        days: activity.day.toISO(),
        weekNumber: activity.weekNumber,
        distance: activity.distance ? activity.distance / 1000 : null,
        elevation: activity.elevation ? activity.elevation : null,
      }));

    return {
      type: 'bar',
      data: {
        datasets: [
          {
            label: 'Distance',
            data: formattedActivityData.map(d => {
              return {
                x: d.days,
                y: d.distance,
              };
            }),
            backgroundColor: 'rgba(148,159,177,0.2)',
            borderColor: 'rgba(148,159,177,1)',
          },
        ],
      },
      options: {
        scales: {
          x: {
            type: 'time',
            time: {
              unit: 'day',
            },
            min: DateTime.now().startOf('month').toISO(),
            max: DateTime.now().endOf('month').toISO(),
          },
          y: {
            beginAtZero: true,
          },
        },
      },
    };
  });
}
