import { CommonModule } from '@angular/common';
import { Component, computed, inject, input, Signal } from '@angular/core';
import { DateTime } from 'luxon';
import { PrimeIcons } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { SkeletonModule } from 'primeng/skeleton';
import { CardDataInformations } from 'src/app/types/data-card.type';
import {
  DailyDetails,
  WeeklyInformations,
} from 'src/app/types/strava-extracted-informations.type';
import { APP_COLORS } from 'src/styles/_colorVariables';
import { ConvertUnitPipe } from '../../pipes/convert-unit.pipe';
import { ToDashboardTimePipe } from '../../pipes/to-dashboard-time.pipe';
import { toIconPipe } from '../../pipes/to-icon.pipe';
import { CardService } from '../../services/card.service';
import { DataComputationsService } from '../../services/data-computations.service';
import { StravaService } from '../../services/strava.service';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-cards',
  standalone: true,
  imports: [
    CommonModule,
    IconComponent,
    ConvertUnitPipe,
    toIconPipe,
    SkeletonModule,
    ToDashboardTimePipe,
    ButtonModule,
  ],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss',
})
export class CardComponent {
  public cardService = inject(CardService);
  public stravaService = inject(StravaService);
  public dataComputationsService = inject(DataComputationsService);

  public activities$ = input.required<WeeklyInformations>();
  public lastActivity$ = input.required<DailyDetails | null>();

  private primeIcon = PrimeIcons;
  public appColors = APP_COLORS;

  public cardsCollection$: Signal<CardDataInformations[]> = computed(() => {
    return [
      this.weeklyDistanceCard$(),
      this.weeklyElevationGainCard$(),
      this.weeklyTimeSpendCard$(),
      this.lastActivityCard$(),
    ];
  });

  private weeklyDistanceCard$: Signal<CardDataInformations> = computed(() => {
    return {
      id: 'distance',
      title: 'Distance',
      icon: 'running',
      isPrimeIcon: false,
      mainValue: this.weeklyInformations$().currentWeek.totalDistance,
      mainValueUnit: 'km',
      evolutionIcon:
        this.weeklyInformations$().currentWeek.totalDistance -
          this.weeklyInformations$().lastWeek.totalDistance >
        0
          ? this.primeIcon.ARROW_UP
          : this.primeIcon.ARROW_DOWN,
      evolutionValue:
        this.weeklyInformations$().currentWeek.totalDistance -
        this.weeklyInformations$().lastWeek.totalDistance,
      evolutionColor:
        this.weeklyInformations$().currentWeek.totalDistance -
          this.weeklyInformations$().lastWeek.totalDistance >
        0
          ? APP_COLORS.GREEN
          : APP_COLORS.LIGHT_RED,
      evolutionUnit: 'km',
      evolutionSentence: 'since last week',
      color: APP_COLORS.YELLOW,
    };
  });

  private weeklyElevationGainCard$: Signal<CardDataInformations> = computed(
    () => {
      return {
        id: 'elevation',
        title: 'Elevation',
        icon: 'mountains',
        isPrimeIcon: false,
        mainValue: this.weeklyInformations$().currentWeek.totalElevation,
        mainValueUnit: 'm',
        evolutionValue:
          this.weeklyInformations$().currentWeek.totalElevation -
          this.weeklyInformations$().lastWeek.totalElevation,
        evolutionIcon:
          this.weeklyInformations$().currentWeek.totalElevation -
            this.weeklyInformations$().lastWeek.totalElevation >
          0
            ? this.primeIcon.ARROW_UP
            : this.primeIcon.ARROW_DOWN,
        evolutionColor:
          this.weeklyInformations$().currentWeek.totalElevation -
            this.weeklyInformations$().lastWeek.totalElevation >
          0
            ? APP_COLORS.GREEN
            : APP_COLORS.LIGHT_RED,
        evolutionUnit: 'm',
        evolutionSentence: 'since last week',
        color: APP_COLORS.LIGHT_BLUE,
      };
    }
  );

  private lastActivityCard$: Signal<CardDataInformations> = computed(() => {
    return {
      id: 'lastActivity',
      title: 'Last activity',
      icon: PrimeIcons.CALENDAR,
      isPrimeIcon: true,
      mainValue: this.lastActivity$()?.distance ?? 0,
      mainValueUnit: 'km',
      evolutionValue: this.lastActivity$()?.elevation ?? 0,
      evolutionColor: APP_COLORS.DARK,
      evolutionIcon: this.primeIcon.ARROW_UP_RIGHT,
      evolutionUnit: 'm',
      evolutionSentence: 'Elevation gain',
      color: APP_COLORS.LIGHT_RED,
    };
  });

  private weeklyTimeSpendCard$: Signal<CardDataInformations> = computed(() => {
    const card: CardDataInformations = {
      id: 'time',
      title: 'Time',
      icon: 'time',
      isPrimeIcon: true,
      mainValue: this.weeklyInformations$().currentWeek.totalTime,
      mainValueUnit: 'h',
      evolutionIcon:
        this.weeklyInformations$().currentWeek.totalTime -
          this.weeklyInformations$().lastWeek.totalTime >
        0
          ? this.primeIcon.ARROW_UP
          : this.primeIcon.ARROW_DOWN,
      evolutionValue:
        this.weeklyInformations$().currentWeek.totalTime -
        this.weeklyInformations$().lastWeek.totalTime,
      evolutionColor:
        this.weeklyInformations$().currentWeek.totalTime -
          this.weeklyInformations$().lastWeek.totalTime >
        0
          ? APP_COLORS.GREEN
          : APP_COLORS.LIGHT_RED,
      evolutionUnit: 'h',
      evolutionSentence: 'since last week',
      color: APP_COLORS.ORANGE,
    };

    return card;
  });

  private currentWeekActivities$ = computed(() => {
    return this.activities$()?.detail?.filter(
      a => a.day.toMillis() > DateTime.now().startOf('week').toMillis()
    );
  });

  private lastWeekActivities$ = computed(() => {
    return this.activities$()?.detail?.filter(
      a =>
        a.day.toMillis() >
          DateTime.now().startOf('week').minus({ weeks: 1 }).toMillis() &&
        a.day.toMillis() <
          DateTime.now().endOf('week').minus({ weeks: 1 }).toMillis()
    );
  });

  private weeklyInformations$: Signal<{
    currentWeek: WeeklyInformations;
    lastWeek: WeeklyInformations;
  }> = computed(() => {
    let currentWeekTotalDistance = 0;
    let currentWeekTotalTime = 0;
    let currentWeekTotalElevation = 0;
    let lastWeekTotalDistance = 0;
    let lastWeekTotalTime = 0;
    let lastWeekTotalElevation = 0;

    this.currentWeekActivities$()?.forEach(a => {
      currentWeekTotalDistance += a.distance ?? 0;
      currentWeekTotalTime += a.timeInSeconds ?? 0;
      currentWeekTotalElevation += a.elevation ?? 0;
    });

    this.lastWeekActivities$()?.forEach(a => {
      lastWeekTotalDistance += a.distance ?? 0;
      lastWeekTotalTime += a.timeInSeconds ?? 0;
      lastWeekTotalElevation += a.elevation ?? 0;
    });

    return {
      currentWeek: {
        totalDistance: currentWeekTotalDistance,
        totalTime: currentWeekTotalTime,
        totalElevation: currentWeekTotalElevation,
        startDate: DateTime.now().startOf('week'),
        endDate: DateTime.now().endOf('week'),
        detail: [],
        lastActivity: this.currentWeekActivities$(),
      },
      lastWeek: {
        totalDistance: lastWeekTotalDistance,
        totalTime: lastWeekTotalTime,
        totalElevation: lastWeekTotalElevation,
        startDate: DateTime.now().startOf('week').minus({ weeks: 1 }),
        endDate: DateTime.now().endOf('week').minus({ weeks: 1 }),
        detail: [],
      },
    };
  });
}
