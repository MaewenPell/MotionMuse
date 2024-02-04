import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { PrimeIcons } from 'primeng/api';
import { CardDataType } from 'src/app/types/card-data.type';
import { APP_COLORS } from 'src/styles/_colorVariables';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule, IconComponent],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss',
})
export class CardComponent implements OnChanges {
  @Input({ required: true }) cardValues!: CardDataType;

  public evolutionIcon!: PrimeIcons;
  public typeIcon!: PrimeIcons;
  public cardIconColor!: string;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['cardValues']) {
      this.cardValues = changes['cardValues'].currentValue;

      switch (this.cardValues.evolutionType) {
        case 'up':
          this.evolutionIcon = PrimeIcons.ARROW_UP;
          this.cardIconColor = APP_COLORS.GREEN;
          break;
        case 'down':
          this.evolutionIcon = PrimeIcons.ARROW_DOWN;
          this.cardIconColor = APP_COLORS.LIGHT_RED;
          break;
        case 'equal':
          this.evolutionIcon = PrimeIcons.ARROW_RIGHT;
          this.cardIconColor = APP_COLORS.DARK;
          break;
      }

      switch (this.cardValues.type) {
        case 'resume':
          this.typeIcon = PrimeIcons.CHART_BAR;
          break;
        case 'evolution':
          this.typeIcon = PrimeIcons.CHART_LINE;
          break;
      }

      // this.cardIconColor = this.getRandomAppColor();
    }
  }

  getRandomAppColor(): string {
    const baseColors: Array<string> = [
      'WHITE',
      'WHITE_60',
      'LIGHT_GRAY',
      'DARK',
    ];
    const colorsKeys = Object.keys(APP_COLORS).filter(key => {
      return !baseColors.includes(key);
    });

    const randomIndex = Math.floor(
      Math.random() * colorsKeys.length - baseColors.length
    );
    return colorsKeys[randomIndex];
  }
}
