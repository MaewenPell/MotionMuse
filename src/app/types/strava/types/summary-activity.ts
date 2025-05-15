import { ActivityType } from '../enum/activity-type.enum';
import { LatLng } from './lat-lng';
import { MetaAthlete } from './meta-athlete';
import { PolylineMap } from './polylinemap';

export type SummaryActivity = {
  id: number; // The unique identifier of the activity
  utc_offset: number; // The timezone offset in seconds
  external_id: string; // The identifier provided at upload time
  upload_id: number; // The identifier of the upload that resulted in this activity
  athlete: MetaAthlete; // An instance of MetaAthlete
  name: string; // The name of the activity
  distance: number; // The activity's distance, in meters
  moving_time: number; // The activity's moving time, in seconds
  elapsed_time: number; // The activity's elapsed time, in seconds
  total_elevation_gain: number; // The activity's total elevation gain
  location_city: string | null; // The activity's starting location city
  location_state: string | null; // The activity's starting location state or region
  location_country: string | null; // The activity's starting location country
  average_cadence?: number; // The average cadence during the activity
  average_heartrate: number; // The activity's average heart rate
  max_heartrate: number; // The activity's max heart rate
  heartrate_opt_out: boolean; // Whether the logged-in athlete has opted out of viewing heartrate data
  display_hide_heartrate_option: boolean; // Whether the logged-in athlete has hidden their heart rate data
  average_temp: number; // The activity's average temperature, in degrees celsius
  from_accepted_tag: boolean; // Whether the activity was recorded on a device that had a barometric altimeter
  has_heartrate: boolean; // Whether the logged-in athlete has heart rate data for this activity
  pr_count: number; // The number of achievements gained during this activity
  elev_high: number; // The activity's highest elevation, in meters
  suffer_score: number; // The activity's suffer score
  elev_low: number; // The activity's lowest elevation, in meters
  visibility: string; // The visibility of the activity
  type: ActivityType | string; // Deprecated. Prefer to use sport_type
  sport_type: ActivityType | string; // An instance of SportType
  start_date: string; // The time at which the activity was started
  start_date_local: string; // The time at which the activity was started in the local timezone
  timezone: string; // The timezone of the activity
  start_latlng: number[]; // An instance of LatLng
  end_latlng: number[]; // An instance of LatLng
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
  workout_type?: number | null; // The activity's workout type
  upload_id_str: string; // The unique identifier of the upload in string format
  average_speed: number; // The activity's average speed, in meters per second
  max_speed: number; // The activity's max speed, in meters per second
  has_kudoed: boolean; // Whether the logged-in athlete has kudoed this activity
  hide_from_home?: boolean; // Whether the activity is muted
  gear_id: string | null; // The id of the gear for the activity
  kilojoules?: number | null; // The total work done in kilojoules during this activity. Rides only
  average_watts?: number | null; // Average power output in watts during this activity. Rides only
  device_watts?: boolean | null; // Whether the watts are from a power meter, false if estimated
  max_watts?: number | null; // Rides with power meter data only
  weighted_average_watts?: number | null; // Similar to Normalized Power. Rides with power meter data only
};
