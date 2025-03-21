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
  placeDetails?: PlaceDetails | null;
}

export interface PlaceDetails {
  name: string;
  address: string;
  opening_hours: {
    open_now: boolean;
    periods?: { close: { day: number; time: string }; open: { day: number; time: string } }[];
    weekday_text: string[];
  };
  rating: number;
  total_reviews: number;
  url: string;
  photoReference: string;
  icon: [string, string];
}

export interface TargetedPlaceData {
  place_id: string;
  name: string;
  photo_reference?: string;
  rating: number;
  total_reviews: number;
  type: string;
  icon: [string, string];
  vicinity: string;
  photo_url: string;
}
