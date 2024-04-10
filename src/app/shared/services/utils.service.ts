import { Injectable } from '@angular/core';
import { DateTime } from 'luxon';
import { WeeklyInformations } from 'src/app/types/strava-extracted-informations.type';

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

  fillWeeklyMissingData(
    weeklyInfo: WeeklyInformations,
    startDate: DateTime
  ): WeeklyInformations {
    const allWeekDays: DateTime[] = [];

    for (let i = 0; i < 7; i++) {
      const currentDay = startDate.plus({ days: i });
      allWeekDays.push(currentDay);
    }

    allWeekDays.forEach((day: DateTime) => {
      const currentDayDate = day.toISODate();

      if (currentDayDate) {
        weeklyInfo.detail.forEach(dayDetail => {
          if (
            dayDetail.day.toISODate() !== currentDayDate &&
            !weeklyInfo.detail.find(
              detail => detail.day.toISODate() === currentDayDate
            )
          ) {
            weeklyInfo.detail.push({
              day: day,
              weekNumber: day.weekNumber,
              distance: null,
              elevation: 0,
              timeInSeconds: 0,
            });
          }
        });
      }
    });

    return weeklyInfo;
  }
}
