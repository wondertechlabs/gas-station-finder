import { useMemo } from 'react';
import type { CameraPosition } from 'expo-maps';
import { MAP_CONFIG } from '~/shared/constants';
import { useCurrentLocation } from '~/presentation/stores/locationStore';

export const useMapCamera = (): CameraPosition => {
  const currentLocation = useCurrentLocation();

  return useMemo(
    () => ({
      coordinates: currentLocation ?? MAP_CONFIG.MANAGUA_COORDINATES,
      zoom: MAP_CONFIG.DEFAULT_ZOOM,
    }),
    [currentLocation],
  );
};
