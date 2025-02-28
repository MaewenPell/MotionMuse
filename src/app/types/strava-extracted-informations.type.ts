import { DateTime } from 'luxon';
import { SummaryActivity } from './strava/types/summary-activity';
import { ActivityType } from "./strava/enum/activity-type.enum";

export type StravaExtractedInformations = {
  lastWeek: WeeklyInformations;
  currentWeek: WeeklyInformations;
};

export type DailyDetails = {
  day: DateTime;
  weekNumber: number;
  distance: number | null;
  elevation: number;
  timeInSeconds: number;
  activityType: ActivityType
};

export type WeeklyInformations = {
  startDate: DateTime;
  endDate: DateTime;
  totalDistance: number;
  totalElevation: number;
  totalTime: number;
  detail: DailyDetails[];
};

export type totalInfomations = {
  date: string;
  distance: number;
  elevation: number;
};
