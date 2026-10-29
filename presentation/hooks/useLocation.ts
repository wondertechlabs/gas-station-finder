import { useEffect } from 'react';
import { useLocationStore } from '~/presentation/stores/locationStore';

export const useLocation = () => {
  const userLocation = useLocationStore((state) => state.userLocation);
  const isLoading = useLocationStore((state) => state.isLoading);
  const error = useLocationStore((state) => state.error);
  const getCurrentLocation = useLocationStore(
    (state) => state.getCurrentLocation,
  );

  useEffect(() => {
    if (!userLocation && !isLoading && !error) {
      getCurrentLocation();
    }
  }, [userLocation, isLoading, error, getCurrentLocation]);

  return { userLocation, isLoading, error, getCurrentLocation };
};
