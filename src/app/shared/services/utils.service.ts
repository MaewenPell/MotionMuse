import { Injectable } from '@angular/core';
import { DateTime } from 'luxon';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  snakeCaseToCamelCase(str: string): string {
    return str.replace(/([-_][a-z])/g, group =>
      group.toUpperCase().replace('-', '').replace('_', '')
    );
  }

  camelCaseToSnakeCase(str: string): string {
    return str
      .replace(/([A-Z])/g, group => `_${group.toLowerCase()}`)
      .replace(/^_/, '');
  }

  isTokenStillAvailable(expirationDateInSec: number): boolean {
    const now = DateTime.now();
    const expirationDatetime = DateTime.fromSeconds(expirationDateInSec);

    const oneHoursInMs = DateTime.fromObject({ hour: 1 }).toMillis();

    // if the difference between now and expirationDatetime is less than 1h return false
    return expirationDatetime.diff(now).toMillis() < oneHoursInMs;
  }
}
