export interface PlanInfo {
  startTime: string[];
  endTime: string[];
  transport: string;
  geocode: google.maps.LatLngLiteral;
  formattedAddress: string;
  routeType: string;
}

export interface ScheduleBlock {
  start: string;
  end: string;
  activityType: string;
  placeId?: string | null;
  travel?: { distance: string; duration: string } | null;
}
