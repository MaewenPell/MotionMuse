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
      return '< 1';
    } else {
      const formattedDuration = duration.toFormat("hh'h'mm");
      return isNegative ? '-' + formattedDuration : formattedDuration;
    }
  }
}
