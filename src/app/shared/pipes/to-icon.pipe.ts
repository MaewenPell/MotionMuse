import { Pipe, PipeTransform } from '@angular/core';
import { PrimeIcons } from "primeng/api";
import { Icons } from 'src/app/types/icons';

@Pipe({
  name: 'toIcon',
  standalone: true,
})
export class toIconPipe implements PipeTransform {
  transform(value: Icons): PrimeIcons | string {
    switch (value) {
      case 'resume':
        return PrimeIcons.CHECK;
      case 'evolution':
        return PrimeIcons.CHART_LINE;
      case 'up':
        return PrimeIcons.ARROW_UP;
      case 'down':
        return PrimeIcons.ARROW_DOWN;
      case 'equal':
        return PrimeIcons.ARROW_RIGHT;
      case 'calendar':
        return PrimeIcons.CALENDAR;
      case 'time':
        return PrimeIcons.CLOCK;
      case 'shoe':
        return '../../../assets/icons/mountains.svg';
      case 'running':
        return '../../../assets/icons/running.svg';
      case 'mountains':
        return '../../../assets/icons/mountains.svg';
      default:
        return value;
    }
  }
}
