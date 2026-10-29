import { fetchJson } from '~/infrastructure/http/fetchJson';
import { getGoogleMapsApiKey } from '~/infrastructure/config/env';
import type { GooglePlacesNearbySearchResponse } from './types';

const BASE_URL = 'https://maps.googleapis.com/maps/api/place';

function buildUrl(
  path: string,
  params: Record<string, string | number | undefined>,
) {
  const apiKey = getGoogleMapsApiKey();
  if (!apiKey) {
    throw new Error('Google Maps API Key not configured');
  }

  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined) continue;
    searchParams.set(key, String(value));
  }
  searchParams.set('key', apiKey);
  return `${BASE_URL}/${path}?${searchParams.toString()}`;
}

export const GooglePlacesClient = {
  async nearbyGasStations(params: {
    latitude: number;
    longitude: number;
    radius: number;
    language?: string;
    region?: string;
  }): Promise<{ response: Response; data: GooglePlacesNearbySearchResponse }> {
    const url = buildUrl('nearbysearch/json', {
      location: `${params.latitude},${params.longitude}`,
      radius: params.radius,
      type: 'gas_station',
      language: params.language ?? 'es',
      region: params.region ?? 'ni',
    });

    return fetchJson<GooglePlacesNearbySearchResponse>(url);
  },
};
