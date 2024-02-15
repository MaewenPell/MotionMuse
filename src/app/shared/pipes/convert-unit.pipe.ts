import { Pipe, PipeTransform } from '@angular/core';
import { UnitSource } from 'src/app/types/unit-source';

@Pipe({
  name: 'convertUnit',
  standalone: true,
})
export class ConvertUnitPipe implements PipeTransform {
  transform(
    value: number,
    unitSource: UnitSource,
    unitDest: UnitSource
  ): number {
    switch (unitSource) {
      case 'm':
        return unitDest === 'km' ? value / 1000 : value;
      case 'km':
        return unitDest === 'm' ? value * 1000 : value;
    }
  }
}
