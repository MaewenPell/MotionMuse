import { Component, computed, effect, input, signal } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import 'chartjs-adapter-luxon';
import { DateTime } from 'luxon';
import { BaseChartDirective } from 'ng2-charts';
import { ButtonModule } from 'primeng/button';
import {
  DailyDetails,
  WeeklyInformations,
} from 'src/app/types/strava-extracted-informations.type';
import { APP_COLORS } from 'src/styles/_colorVariables';

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
  //#region Inputs
  public yearActivities$ = input.required<WeeklyInformations>();
  //#endregion

  private updateCurrentWeekActivitesEffect = effect(() => {
    if (this.yearActivities$()) {
      this.getCurrentWeekActivity();
    }
  });

  //#region Signal
  private currentWeekNumberDisplayed$ = signal<number>(
    DateTime.now().weekNumber.valueOf()
  );

  private currentWeekActivity$ = signal<DailyDetails[]>([]);
  //#endregion

  //#region Computed
  public incorrectNextWeek$ = computed(() => {
    return this.currentWeekNumberDisplayed$() === DateTime.now().weekNumber;
  });

  public subtitleWeeklyChart$ = computed<string>(() => {
    const startOfWeek = `${DateTime.fromObject({ weekNumber: this.currentWeekNumberDisplayed$() }).toLocaleString()}`;
    const endOfWeek = `${DateTime.fromObject({ weekNumber: this.currentWeekNumberDisplayed$() }).endOf('week').toLocaleString()}`;
    return `From ${startOfWeek} to ${endOfWeek}`;
  });

  public weeklyChart$ = computed<ChartConfig>(() => {
    const formattedActivityData = this.currentWeekActivity$().map(activity => ({
      days: activity.day.startOf('day').toISO(),
      weekNumber: activity.weekNumber,
      distance: activity.distance ? activity.distance / 1000 : null,
      elevation: activity.elevation ? activity.elevation : null,
    }));

    return {
      type: 'bar',
      data: {
        responsive: true,
        datasets: [
          {
            label: 'Distance',
            data: formattedActivityData.map(d => {
              return {
                x: d.days,
                y: d.distance,
              };
            }),
            backgroundColor: ctx => {
              return this.getGraphColor(ctx.dataIndex, true);
            },
            // borderColor: ctx => {
            //   return this.getGraphColor(ctx.dataIndex, false);
            // },
            borderColor: APP_COLORS.WHITE,
            borderWidth: 1,
            borderRadius: {
              topLeft: 10,
              topRight: 10,
              bottomLeft: 0,
              bottomRight: 0,
            },
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          x: {
            type: 'time',
            time: {
              unit: 'day',
            },
            min:
              DateTime.fromObject({
                weekNumber: this.currentWeekNumberDisplayed$(),
              })
                .startOf('week')
                .toISO() ?? '',
            max:
              DateTime.fromObject({
                weekNumber: this.currentWeekNumberDisplayed$(),
              })
                .endOf('week')
                .toISO() ?? '',
            ticks: {
              color: '#6b7280',
              font: {
                size: 12,
                weight: 'bold',
              },
            },
          },
          y: {
            beginAtZero: true,
            ticks: {
              color: '#6b7280',
              font: {
                size: 12,
                weight: 'bold',
              },
            },
            grid: {
              drawBorder: false,
              color: '#e5e7eb', // subtle grid
            },
          },
        },
        // plugins: {
        //   legend:
        // }
      },
    };
  });

  public monthlyChart$ = computed<ChartConfig>(() => {
    const threeWeeksAgoStart = DateTime.now()
      .minus({ weeks: 3 })
      .startOf('week');

    const formattedActivityData = this.yearActivities$()
      ?.detail.filter(activities => activities.day > threeWeeksAgoStart)
      .map(activity => ({
        days: activity.day.startOf('day').toISO(),
        weekNumber: activity.weekNumber,
        distance: activity.distance ? activity.distance / 1000 : null,
        elevation: activity.elevation ? activity.elevation : null,
      }));

    return {
      type: 'bar',
      data: {
        responsive: true,
        datasets: [
          {
            label: 'Distance',
            data: formattedActivityData.map(d => {
              return {
                x: d.days,
                y: d.distance,
              };
            }),
            backgroundColor: APP_COLORS.GREEN_60,
            borderRadius: {
              topLeft: 5,
              topRight: 5,
              bottomLeft: 0,
              bottomRight: 0,
            },
            borderWidth: 1,
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
            min: threeWeeksAgoStart.toISO(),
            max: DateTime.now().toISO(),
            ticks: {
              color: '#6b7280',
              font: {
                size: 12,
                weight: 'bold',
              },
            },
          },
          y: {
            beginAtZero: true,
            ticks: {
              color: '#6b7280',
              font: {
                size: 12,
                weight: 'bold',
              },
            },
            grid: {
              drawBorder: false,
              color: '#e5e7eb', // subtle grid
            },
          },
        },
      },
    };
  });
  //#endregion

  //#region functions
  private getCurrentWeekActivity() {
    this.currentWeekActivity$.update(value => {
      value = this.yearActivities$().detail.filter(detail => {
        return detail.weekNumber === this.currentWeekNumberDisplayed$();
      });

      return value;
    });
  }

  private getGraphColor(dataIndex: number, isAlpha: boolean) {
    if (dataIndex || dataIndex === 0) {
      const activityType = this.currentWeekActivity$()[dataIndex].activityType;

      switch (activityType) {
        case 'BackcountrySki':
        case 'NordicSki':
          return isAlpha ? APP_COLORS.LIGHT_BLUE_60 : APP_COLORS.LIGHT_BLUE;
        case 'Ride':
          return isAlpha ? APP_COLORS.ORANGE_60 : APP_COLORS.ORANGE;
        case 'Run':
        case 'TrailRun':
          return isAlpha ? APP_COLORS.GREEN_60 : APP_COLORS.GREEN;
        default:
          return isAlpha ? APP_COLORS.LIGHT_GRAY_60 : APP_COLORS.LIGHT_GRAY;
      }
    }
    return isAlpha ? APP_COLORS.LIGHT_GRAY_60 : APP_COLORS.LIGHT_GRAY;
  }

  public setPreviousWeekNumber() {
    this.currentWeekNumberDisplayed$.update(value => {
      return (value = value - 1);
    });

    this.getCurrentWeekActivity();
  }

  public setNextWeekNumber() {
    this.currentWeekNumberDisplayed$.update(value => {
      return (value = value + 1);
    });

    this.getCurrentWeekActivity();
  }
}
