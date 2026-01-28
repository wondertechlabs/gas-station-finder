export type GooglePlacesStatus =
  | 'OK'
  | 'ZERO_RESULTS'
  | 'OVER_QUERY_LIMIT'
  | 'REQUEST_DENIED'
  | 'INVALID_REQUEST'
  | 'UNKNOWN_ERROR';

export type LatLng = { lat: number; lng: number };

export interface GooglePlaceGeometry {
  location: LatLng;
}

export interface GooglePlaceResult {
  place_id: string;
  name: string;
  formatted_address?: string;
  geometry: GooglePlaceGeometry;
  rating?: number;
  user_ratings_total?: number;
  opening_hours?: {
    open_now: boolean;
  };
  types: string[];
  vicinity?: string;
  business_status?: string;
}

export interface GooglePlacesNearbySearchResponse {
  results: GooglePlaceResult[];
  status: GooglePlacesStatus;
  error_message?: string;
}

export interface GooglePlaceDetails {
  name: string;
  formatted_address: string;
  formatted_phone_number?: string;
  opening_hours?: {
    open_now: boolean;
    weekday_text?: string[];
  };
  rating?: number;
  user_ratings_total?: number;
  types: string[];
}

export interface GooglePlacesDetailsResponse {
  result?: GooglePlaceDetails;
  status: GooglePlacesStatus;
  error_message?: string;
}
