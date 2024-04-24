import {
  Component,
  InputSignal,
  inject,
  input,
  model,
  signal,
} from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { EChartsOption } from 'echarts';
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
  private dataComputationService: DataComputationsService = inject(
    DataComputationsService
  );

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

    this.chartOptionsWeekly = {
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
          data: data.map(day => {
            return [day.days, day.distance];
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
            return [day.days, day.elevation];
          }),
          smooth: true,
        },
      ],
      grid: {
        top: '10',
        left: '30',
      },
    };
  }

  private computeAllWeeksEvolutionsChart(activities: WeeklyInformations) {
    this.subtitleYearlyChart$.set(
      `From : ${this.startOfyear.setLocale('en-gb').toLocaleString({ weekday: 'short', month: 'short', day: '2-digit' })} to ${this.endOfYear.setLocale('en-gb').toLocaleString({ weekday: 'short', month: 'short', day: '2-digit' })}`
    );

    const chartInformationPerWeek =
      this.dataComputationService.extractTotalInformationPerWeek(activities);

    this.chartOptionsWeeklyEvolutions = {
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
      grid: {
        top: '10',
        left: '30',
      },
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
