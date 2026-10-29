import type {
  GasStationRepository,
  FindNearbyGasStationsParams,
} from '~/domain/gasStation/repository';
import type { Coordinates, GasStation } from '~/domain/gasStation/models';
import {
  determineBrand,
  estimateFuelPrices,
} from '~/domain/gasStation/pricing';
import { distanceInMeters } from '~/domain/geo/distance';
import { isWithinNicaraguaBounds } from '~/domain/geo/nicaragua';
import { GooglePlacesClient } from './googlePlacesClient';
import type { GooglePlaceResult } from './types';

function amenitiesFromTypes(types: string[]): string[] {
  const amenities: string[] = [];
  if (types.includes('store')) amenities.push('Tienda');
  if (types.includes('restaurant')) amenities.push('Restaurante');
  if (types.includes('atm')) amenities.push('Cajero Automático');
  return amenities;
}

function mapPlaceToGasStation(
  place: GooglePlaceResult,
  origin: Coordinates,
): GasStation {
  const brand = determineBrand(place.name);
  const coordinates = {
    latitude: place.geometry.location.lat,
    longitude: place.geometry.location.lng,
  };

  return {
    id: place.place_id,
    name: place.name,
    brand,
    address:
      place.formatted_address || place.vicinity || 'Dirección no disponible',
    coordinates,
    rating: place.rating,
    isOpen: place.opening_hours?.open_now,
    fuelTypes: estimateFuelPrices(brand),
    amenities: amenitiesFromTypes(place.types),
    distance: distanceInMeters(origin, coordinates),
  };
}

export class GooglePlacesGasStationRepository implements GasStationRepository {
  async findNearby(params: FindNearbyGasStationsParams): Promise<GasStation[]> {
    const { response, data } = await GooglePlacesClient.nearbyGasStations({
      latitude: params.latitude,
      longitude: params.longitude,
      radius: params.radius,
      language: 'es',
      region: 'ni',
    });

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    if (data.status === 'ZERO_RESULTS') {
      return [];
    }

    if (data.status !== 'OK') {
      const msg = data.error_message ? ` - ${data.error_message}` : '';
      throw new Error(`Google Places API error: ${data.status}${msg}`);
    }

    // Nearby Search no ofrece filtro por país, así que filtramos por geofence.
    const onlyGasStationsInNicaragua = data.results.filter((place) => {
      const isGasStation = place.types.includes('gas_station');
      const inNicaragua = isWithinNicaraguaBounds(place.geometry.location);
      return isGasStation && inNicaragua;
    });

    const origin = { latitude: params.latitude, longitude: params.longitude };

    return onlyGasStationsInNicaragua
      .map((place) => mapPlaceToGasStation(place, origin))
      .sort((a, b) => (a.distance ?? 0) - (b.distance ?? 0));
  }
}
