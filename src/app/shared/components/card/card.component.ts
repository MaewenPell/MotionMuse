import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  inject,
  input,
  signal,
  Signal,
} from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { DateTime } from 'luxon';
import { ButtonModule } from 'primeng/button';
import { SkeletonModule } from 'primeng/skeleton';
import { CardDataInformations } from 'src/app/types/data-card.type';
import { WeeklyInformations } from 'src/app/types/strava-extracted-informations.type';
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
  public activities$ = input.required<WeeklyInformations>();

  public cardService = inject(CardService);
  public stravaService = inject(StravaService);
  public dataComputationsService = inject(DataComputationsService);

  public appColors = APP_COLORS;
  public cards: CardDataInformations[] = [];

  // private weeklyInformations: StravaExtractedInformations = {
  //   lastWeek: {
  //     startDate: DateTime.now(),
  //     endDate: DateTime.now(),
  //     totalDistance: 0,
  //     totalElevation: 0,
  //     totalTime: 0,
  //     detail: [],
  //     lastActivity: null,
  //   },
  //   currentWeek: {
  //     startDate: DateTime.now(),
  //     endDate: DateTime.now(),
  //     totalDistance: 0,
  //     totalElevation: 0,
  //     totalTime: 0,
  //     detail: [],
  //     lastActivity: null,
  //   },
  // };

  private weeklyDistanceCard: Signal<CardDataInformations | null> = computed(()=> {
        return {
          title: 'Distance',
          icon: 'running',
          isPrimeIcon: false,
          mainValue: this.weeklyInformations().currentWeek.totalDistance / 1000,
          mainValueUnit: 'km',
          evolutionIcon:
            currentWeek.totalDistance - lastWeek.totalDistance > 0
              ? this.primeIcon.ARROW_UP
              : this.primeIcon.ARROW_DOWN,
          evolutionValue: currentWeek.totalDistance - lastWeek.totalDistance,
          evolutionColor:
            currentWeek.totalDistance - lastWeek.totalDistance > 0
              ? APP_COLORS.GREEN
              : APP_COLORS.LIGHT_RED,
          evolutionUnit: 'km',
          evolutionSentence: 'since last week',
          color: APP_COLORS.YELLOW,
        };
  });
  private weeklyElevationGainCard: Signal<CardDataInformations | null> =
    signal(null);
  private weeklyTimeSpendCard: Signal<CardDataInformations | null> =
    signal(null);
  private lastActivityCard: Signal<CardDataInformations | null> = signal(null);

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

  private weeklyInformations: Signal<{
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
      },
      lastWeek: {
        totalDistance: lastWeekTotalDistance,
        totalTime: lastWeekTotalTime,
        totalElevation: lastWeekTotalElevation,
        startDate: DateTime.now().startOf('week').minus({ weeks: 1 }),
        endDate: DateTime.now().endOf('week').minus({ weeks: 1 }),
      },
    };
  });

  constructor() {
    toObservable(this.activities$).subscribe(() => {
      if (this.activities$()?.detail?.length) {
        this.weeklyDistanceCard = this.cardService.createWeeklyDistanceCard(
          this.weeklyInformations$().currentWeek,
          this.weeklyInformations.lastWeek
        );

        this.weeklyElevationGainCard =
          this.cardService.createWeeklyElevationCard(
            this.weeklyInformations.currentWeek,
            this.weeklyInformations.lastWeek
          );

        this.lastActivityCard = this.cardService.createLastActivityCard(
          currentWeekActivities[currentWeekActivities.length - 1].distance ??
            0 / 1000,
          currentWeekActivities[currentWeekActivities.length - 1].elevation
        );

        this.weeklyTimeSpendCard = this.cardService.createWeeklyTimeSpendCard(
          this.weeklyInformations.currentWeek,
          this.weeklyInformations.lastWeek
        );

        this.cards.push(
          this.weeklyDistanceCard,
          this.weeklyElevationGainCard,
          this.weeklyTimeSpendCard,
          this.lastActivityCard
        );
      }
    });
  }
}
