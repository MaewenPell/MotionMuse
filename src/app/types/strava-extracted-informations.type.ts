export type StravaExtractedInformations = {
  lastWeek: WeeklyInformations;
  currentWeek: WeeklyInformations;
};

export type WeeklyInformations = {
  totalDistance: number;
  totalElevation: number;
  totalTime: number;
};
