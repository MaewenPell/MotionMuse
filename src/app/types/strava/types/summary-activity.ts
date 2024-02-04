import { ActivityType } from '../enum/activity-type.enum';
import { LatLng } from './lat-lng';
import { MetaAthlete } from './meta-athlete';
import { PolylineMap } from './polylinemap';

export type SummaryActivity = {
  id: number; // The unique identifier of the activity
  external_id: string; // The identifier provided at upload time
  upload_id: number; // The identifier of the upload that resulted in this activity
  athlete: MetaAthlete; // An instance of MetaAthlete
  name: string; // The name of the activity
  distance: number; // The activity's distance, in meters
  moving_time: number; // The activity's moving time, in seconds
  elapsed_time: number; // The activity's elapsed time, in seconds
  total_elevation_gain: number; // The activity's total elevation gain
  elev_high: number; // The activity's highest elevation, in meters
  elev_low: number; // The activity's lowest elevation, in meters
  type: ActivityType; // Deprecated. Prefer to use sport_type
  sport_type: ActivityType; // An instance of SportType
  start_date: Date; // The time at which the activity was started
  start_date_local: Date; // The time at which the activity was started in the local timezone
  timezone: string; // The timezone of the activity
  start_latlng: LatLng; // An instance of LatLng
  end_latlng: LatLng; // An instance of LatLng
  achievement_count: number; // The number of achievements gained during this activity
  kudos_count: number; // The number of kudos given for this activity
  comment_count: number; // The number of comments for this activity
  athlete_count: number; // The number of athletes for taking part in a group activity
  photo_count: number; // The number of Instagram photos for this activity
  total_photo_count: number; // The number of Instagram and Strava photos for this activity
  map: PolylineMap; // An instance of PolylineMap
  trainer: boolean; // Whether this activity was recorded on a training machine
  commute: boolean; // Whether this activity is a commute
  manual: boolean; // Whether this activity was created manually
  private: boolean; // Whether this activity is private
  flagged: boolean; // Whether this activity is flagged
  workout_type: number; // The activity's workout type
  upload_id_str: string; // The unique identifier of the upload in string format
  average_speed: number; // The activity's average speed, in meters per second
  max_speed: number; // The activity's max speed, in meters per second
  has_kudoed: boolean; // Whether the logged-in athlete has kudoed this activity
  hide_from_home: boolean; // Whether the activity is muted
  gear_id: string; // The id of the gear for the activity
  kilojoules: number; // The total work done in kilojoules during this activity. Rides only
  average_watts: number; // Average power output in watts during this activity. Rides only
  device_watts: boolean; // Whether the watts are from a power meter, false if estimated
  max_watts: number; // Rides with power meter data only
  weighted_average_watts: number; // Similar to Normalized Power. Rides with power meter data only
};
