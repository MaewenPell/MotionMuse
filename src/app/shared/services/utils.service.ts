import { Injectable } from '@angular/core';
import { DateTime } from 'luxon';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  isTokenStillAvailable(expirationDateInSecFromEpoch: number): boolean {
    const now = DateTime.now();
    const expirationDatetime = DateTime.fromSeconds(
      expirationDateInSecFromEpoch
    );

    const expirationDatetimeObject = expirationDatetime
      .diff(now)
      .shiftTo('hours', 'minutes')
      .toObject();

    if (
      expirationDatetimeObject.hours !== undefined &&
      expirationDatetimeObject.hours < 1
    ) {
      return false;
    }
    return true;
  }
}
