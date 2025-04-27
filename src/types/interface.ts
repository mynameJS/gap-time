export interface PlanInfo {
  startTime: string[];
  endTime: string[];
  geocode: google.maps.LatLngLiteral;
  formattedAddress: string;
  routeType: string;
}

export interface ScheduleBlock {
  start: string;
  end: string;
  activityType: string;
  placeId?: string | null;
  travel?: {
    distance: number;
    duration: string;
    polyline: string;
    origin: google.maps.LatLngLiteral | undefined;
    destination: google.maps.LatLngLiteral | undefined;
  } | null;
  placeDetails?: PlaceDetails | null;
}

export interface PlaceDetails {
  place_id: string;
  name: string;
  address: string;
  open_hours: {
    open_now: boolean;
    periods?: { close: { day: number; time: string }; open: { day: number; time: string } }[];
    weekday_text: string[];
  };
  rating: number;
  total_reviews: number;
  url: string;
  photo_reference?: string;
  photo_url: string;
  icon: [string, string];
  phone_number: string;
  website: string;
  summary: string;
  geocode: google.maps.LatLngLiteral;
  type: string;
  vicinity: string;
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
  geocode: google.maps.LatLngLiteral;
  open_hours: {
    open_now: boolean;
    periods?: { close: { day: number; time: string }; open: { day: number; time: string } }[];
    weekday_text: string[];
  };
  url: string;
  phone_number: string;
  website: string;
  summary: string;
  address: string;
}

export interface GeocodeItem {
  place_id: string;
  geocode: google.maps.LatLngLiteral;
}

export interface UserInfo {
  uid: string;
  email: string;
  nickname: string;
  provider?: string;
}

export interface PlanWithSchedule {
  createdAt: string;
  createdAddress: string;
  routeType: string;
  planName: string | null;
  schedule: ScheduleBlock[];
}

export interface ChatMessage {
  role: 'user' | 'gpt';
  content: string | PlaceDetails[];
}
