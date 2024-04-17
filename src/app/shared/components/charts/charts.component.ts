import {
  Component,
  InputSignal,
  effect,
  inject,
  input,
  model,
} from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { EChartsOption } from 'echarts';
import { groupBy, mapValues, sumBy } from 'lodash-es';
import { DateTime } from 'luxon';
import { NgxEchartsDirective } from 'ngx-echarts';
import { ButtonModule } from 'primeng/button';
import { WeeklyInformations } from 'src/app/types/strava-extracted-informations.type';
import { SummaryActivity } from 'src/app/types/strava/types/summary-activity';
import { APP_COLORS } from 'src/styles/_colorVariables';
import { DataComputationsService } from '../../services/data-computations.service';

@Component({
  selector: 'app-charts',
  standalone: true,
  imports: [NgxEchartsDirective, ButtonModule],
  templateUrl: './charts.component.html',
  styleUrl: './charts.component.scss',
})
export class ChartsComponent {
  public activities$ = model<SummaryActivity[]>();

  public yearActivities$: InputSignal<SummaryActivity[]> =
    input.required<SummaryActivity[]>();

  private values!: WeeklyInformations;

  public chartOptionsWeekly!: EChartsOption;
  public chartOptionsWeeklyEvolutions!: EChartsOption;

  public startDate: DateTime = DateTime.now().startOf('week');
  public endDate: DateTime = DateTime.now().endOf('week');

  private startOfyear!: DateTime;
  private endOfYear!: DateTime;

  private dataComputationService: DataComputationsService = inject(
    DataComputationsService
  );

  private getActivitiesReaction = effect(() => {});

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
    const data = activities.map(activity => ({
      days: activity.day.startOf('day').toISO(),
      weekNumber: activity.weekNumber,
      distance: activity.distance ? activity.distance / 1000 : null,
      elevation: activity.elevation ? activity.elevation : null,
    }));

    this.chartOptionsWeekly = {
      title: {
        text: `From : ${this.startDate.toLocaleString({ weekday: 'short', month: 'short', day: '2-digit' })} to ${this.endDate.toLocaleString({ weekday: 'short', month: 'short', day: '2-digit' })}`,
        left: 'center',
        top: '10',
      },
      xAxis: {
        type: 'time',
        axisPointer: {
          label: {
            formatter: params =>
              DateTime.fromMillis(Number(params.value)).toLocaleString(),
          },
        },
        axisLabel: {
          formatter: value => {
            return DateTime.fromMillis(value).toFormat('ccc');
          },
        },
      },
      yAxis: [
        {
          name: 'Distance',
          type: 'value',
          position: 'left',
          max: 50,
          min: 0,
          alignTicks: true,
          axisPointer: {
            label: {
              precision: 0,
            },
          },
        },
        {
          name: 'Elevation',
          type: 'value',
          max: 3000,
          min: 0,
          alignTicks: true,
          position: 'right',
          axisPointer: {
            label: {
              precision: 0,
            },
          },
        },
      ],
      tooltip: {
        formatter: (params: any) => {
          if (!params[0]?.data[1]) {
            return `${params[0]?.axisValueLabel}<br> 
          ${params[0].marker} ${params[0].seriesName} : 0 <br>
          ${params[1].marker} ${params[1].seriesName} : 0`;
          }
          return `${params[0]?.axisValueLabel}<br> 
          ${params[0].marker} ${params[0].seriesName} : ${params[0]?.data[1]?.toFixed(0)} Km <br>
          ${params[1].marker} ${params[1].seriesName} : ${params[1]?.data[1]?.toFixed(0)} m <br>`;
        },
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
        },
      },
      legend: {
        data: ['Distance', 'Elevation'],
        bottom: 10,
      },
      series: [
        {
          name: 'Distance',
          type: 'bar',
          yAxisIndex: 0,
          itemStyle: {
            color: APP_COLORS.MAIN_VIOLET,
            borderRadius: 5,
          },
          barWidth: '30%',
          data: data.map(day => {
            const distanceGrouped = mapValues(groupBy(data, 'days'), sum =>
              sumBy(sum, 'distance')
            );

            return [day.days, distanceGrouped[day.days ?? 0]];
          }),
        },
        {
          name: 'Elevation',
          type: 'line',
          yAxisIndex: 1,
          itemStyle: {
            color: APP_COLORS.YELLOW,
          },
          data: data.map(day => {
            const elevationGrouped = mapValues(groupBy(data, 'days'), sum =>
              sumBy(sum, 'elevation')
            );

            return [day.days, elevationGrouped[day.days ?? 0]];
          }),
          smooth: true,
        },
      ],
    };
  }

  private computeAllWeeksEvolutionsChart(activities: WeeklyInformations) {
    const chartInformationPerWeek =
      this.dataComputationService.extractTotalInformationPerWeek(activities);

    this.chartOptionsWeeklyEvolutions = {
      title: {
        text: `From : ${this.startOfyear.toLocaleString({ weekday: 'short', month: 'short', day: '2-digit' })} to ${this.endOfYear.toLocaleString({ weekday: 'short', month: 'short', day: '2-digit' })}`,
        left: 'center',
        top: '10',
      },
      xAxis: {
        type: 'time',
        axisPointer: {
          label: {
            formatter: params =>
              DateTime.fromMillis(Number(params.value)).toLocaleString(),
          },
        },
      },
      yAxis: [
        {
          name: 'Distance',
          type: 'value',
          position: 'left',
          alignTicks: true,
          min: 0,
          max: 100,
          axisPointer: {
            label: {
              precision: 0,
            },
          },
        },
        {
          name: 'Elevation',
          type: 'value',
          min: 0,
          max: 4000,
          position: 'right',
          axisPointer: {
            label: {
              precision: 0,
            },
          },
        },
      ],
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
        },
      },
      legend: {
        data: ['Distance', 'Elevation'],
        bottom: '10',
      },
      series: [
        {
          name: 'Distance',
          type: 'bar',
          yAxisIndex: 0,
          itemStyle: {
            color: APP_COLORS.MAIN_VIOLET,
            borderRadius: 5,
          },
          data: chartInformationPerWeek.map(week => {
            return [week.startDate?.toISOString(), week.totalDistance];
          }),
        },
        {
          name: 'Elevation',
          type: 'line',
          yAxisIndex: 1,
          data: chartInformationPerWeek.map(week => {
            return [week.startDate?.toISOString(), week.totalElevation];
          }),
          itemStyle: {
            color: APP_COLORS.YELLOW,
          },
          smooth: true,
        },
      ],
    };
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
    this.startDate = this.startDate.plus({
      week: 1,
    });
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
