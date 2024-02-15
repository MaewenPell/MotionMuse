import { CommonModule } from '@angular/common';
import { Component, effect, inject, input } from '@angular/core';
import { DateTime } from 'luxon';
import { SkeletonModule } from 'primeng/skeleton';
import { CardDataType } from 'src/app/types/card-data.type';
import { CardTypesEnum } from 'src/app/types/enums/cardTypes.enum';
import { APP_COLORS } from 'src/styles/_colorVariables';
import { ConvertUnitPipe } from '../../pipes/convert-unit.pipe';
import { ToIconPipe } from '../../pipes/to-icon.pipe';
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
    ToIconPipe,
    SkeletonModule,
  ],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss',
})
export class CardComponent {
  public cardTypes$ = input.required<CardTypesEnum[]>();

  public stravaService = inject(StravaService);
  public dataComputationsService = inject(DataComputationsService);

  public weeklyDistanceCard!: CardDataType;
  public appColors = APP_COLORS;

  private computeCards = effect(() => {
    this.cardTypes$().forEach(type => {
      switch (type) {
        case CardTypesEnum.WeeklyDistance:
          this.weeklyDistanceCard = this.createWeeklyDistanceCard();
      }
    });
  });

  private createWeeklyDistanceCard(): CardDataType {
    const weeklyDistance = this.dataComputationsService.getTotaRunningDistance(
      this.stravaService.activities$(),
      'currentWeek',
      ['Run', 'TrailRun']
    );

    const lastWeekDistance =
      this.dataComputationsService.getTotaRunningDistance(
        this.stravaService.activities$(),
        'custom',
        ['Run', 'TrailRun'],
        DateTime.now().startOf('week').minus({ week: 1 }),
        DateTime.now().endOf('week').minus({ week: 1 })
      );

    const evolutionSinceLastWeek = weeklyDistance - lastWeekDistance;

    return {
      title: 'Weekly distance',
      value: weeklyDistance,
      unit: 'km',
      evolutionType: evolutionSinceLastWeek > 0 ? 'up' : 'down',
      type: 'evolution',
      color: APP_COLORS.LIGHT_BLUE,
      evolutionSentence: 'vs last week',
      evolutionValue: evolutionSinceLastWeek,
    };
  }
}
