import { Athlete } from './athlete';

export type ConnectionBase = {
  id: number;
  token_type: string;
  expires_at: number;
  expires_in: number;
  refresh_token: string;
  access_token: string;
  athlete: Athlete;
};
