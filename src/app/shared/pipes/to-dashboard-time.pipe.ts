import { Pipe, PipeTransform } from '@angular/core';
import { Duration } from 'luxon';

@Pipe({
  name: 'toDashboardTime',
  standalone: true,
})
export class ToDashboardTimePipe implements PipeTransform {
  transform(value: number): string {
    const isNegative = value < 0;

    if (isNegative) {
      value = -value;
    }
    const duration = Duration.fromObject({ second: value });

    if (value < 60 * 60) {
      return '< 1H';
    } else {
      return isNegative ? '-' + duration.toFormat('h') : duration.toFormat('h');
    }
  }
}
