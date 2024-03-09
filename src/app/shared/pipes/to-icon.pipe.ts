import { Pipe, PipeTransform } from '@angular/core';
import { PrimeIcons } from 'primeng/api';
import { Icons } from 'src/app/types/icons';

@Pipe({
  name: 'toIcon',
  standalone: true,
})
export class toIconPipe implements PipeTransform {
  transform(value: Icons): PrimeIcons {
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
      default:
        return PrimeIcons.CHECK;
    }
  }
}
