import { useMemo } from 'react';
import { MAP_CONFIG } from '~/config/constants';
import { useCurrentLocation } from '~/stores/locationStore';
import { Coordinates } from '~/types/gasStation';

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
