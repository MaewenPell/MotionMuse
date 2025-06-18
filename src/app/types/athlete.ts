export interface Athlete {
  id: number;
  username: string;
  resource_state: number;
  firstname: string;
  lastname: string;
  bio: string;
  city: string;
  state: string;
  country: string | null;
  sex: string;
  premium: boolean;
  summit: boolean;
  created_at: string;
  updated_at: string;
  badge_type_id: number;
  weight: number;
  profile_medium: string;
  profile: string;
  friend: null;
  follower: null;
}
export interface DetailedAthlete {
  id: number;
  resource_state: number;
  username: string;
  bio: string;
  firstname: string;
  lastname: string;
  profile_medium: string;
  profile: string;
  city: string;
  state: string;
  country: string;
  sex: 'M' | 'F';
  premium: boolean;
  summit: boolean;
  created_at: string; // DateTime
  updated_at: string; // DateTime
  follower_count: number;
  friend_count: number;
  measurement_preference: 'feet' | 'meters';
  ftp: number;
  weight: number;
  // clubs: SummaryClub[];
  // bikes: SummaryGear[];
  // shoes: SummaryGear[];
}

export interface AthleteDto {
  id: number;
  username: string;
  resourceState: number;
  firstname: string;
  lastname: string;
  bio: string;
  city: string;
  state: string;
  country: string | null;
  sex: string;
  premium: boolean;
  summit: boolean;
  createdAt: string;
  updatedAt: string;
  badgeTypeId: number;
  weight: number;
  profileMedium: URL;
  profile: URL;
  friend: null;
  follower: null;
}
