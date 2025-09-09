import { useMemo } from 'react';
import { MAP_CONFIG } from '~/config/constants';
import { useLocationStore } from '~/stores/locationStore';

interface Location {
  latitude: number;
  longitude: number;
}

export const useMapRegion = (userLocation: Location | null) => {
  const { selectedLocation } = useLocationStore();
  
  // Usar ubicación seleccionada si existe, sino usar ubicación GPS
  const currentLocation = selectedLocation || userLocation;

  return useMemo(() => {
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
