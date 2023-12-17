export interface Athlete {
  id: number;
  username: string;
  connectionBaseId: number;
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
  profile_medium: URL;
  profile: URL;
  friend: null;
  follower: null;
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
