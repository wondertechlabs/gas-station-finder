import { useMemo } from 'react';
import { MAP_CONFIG } from '~/shared/constants';
import { useCurrentLocation } from '~/presentation/stores/locationStore';
import type { Coordinates } from '~/domain/gasStation/models';

interface MapRegion {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

export const useMapRegion = (userLocation: Coordinates | null): MapRegion => {
  const selectedLocation = useCurrentLocation();

  const currentLocation = selectedLocation || userLocation;

  return useMemo((): MapRegion => {
    if (!currentLocation) {
      return MAP_CONFIG.MANAGUA_COORDINATES;
    }

    return {
      latitude: currentLocation.latitude,
      longitude: currentLocation.longitude,
      latitudeDelta: MAP_CONFIG.MANAGUA_COORDINATES.latitudeDelta,
      longitudeDelta: MAP_CONFIG.MANAGUA_COORDINATES.longitudeDelta,
    };
  }, [currentLocation]);
};
