export type MetaAthlete = {
  id: number; // The unique identifier of the athlete
  resource_state: number; // Resource state, indicates level of detail. Possible values: 1 -> "meta", 2 -> "summary", 3 -> "detail"
};
