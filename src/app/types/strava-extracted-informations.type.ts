import { SummaryActivity } from './strava/types/summary-activity';

export type StravaExtractedInformations = {
  lastWeek: WeeklyInformations;
  currentWeek: WeeklyInformations;
};

export type DailyDetails = {
  day: string;
  distance: number | null;
  elevation: number;
  timeInSeconds: number;
};

export type WeeklyInformations = {
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
