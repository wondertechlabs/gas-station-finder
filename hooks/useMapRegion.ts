import { useMemo } from 'react';
import { MAP_CONFIG } from '~/config/constants';

interface Location {
  latitude: number;
  longitude: number;
}

export const useMapRegion = (userLocation: Location | null) => {
  return useMemo(() => {
    if (!userLocation) {
      return MAP_CONFIG.MANAGUA_COORDINATES;
    }

    return {
      latitude: userLocation.latitude,
      longitude: userLocation.longitude,
      latitudeDelta: MAP_CONFIG.MANAGUA_COORDINATES.latitudeDelta,
      longitudeDelta: MAP_CONFIG.MANAGUA_COORDINATES.longitudeDelta,
    };
  }, [userLocation]);
};
