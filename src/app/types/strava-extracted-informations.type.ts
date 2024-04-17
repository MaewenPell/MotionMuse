import { DateTime } from 'luxon';
import { SummaryActivity } from './strava/types/summary-activity';

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
};

export type WeeklyInformations = {
  startDate: DateTime;
  endDate: DateTime;
  weekNumber: number;
  totalDistance: number;
  totalElevation: number;
  totalTime: number;
  detail: DailyDetails[];
  lastActivity: SummaryActivity | null;
};

export type totalInfomations = {
  date: string;
  distance: number;
  elevation: number;
};
