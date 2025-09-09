import { useEffect } from 'react';
import { useLocationStore } from '~/stores/locationStore';

export const useLocation = () => {
  const {
    userLocation,
    isLoading,
    error,
    hasPermission,
    getCurrentLocation,
    clearError,
  } = useLocationStore();

  useEffect(() => {
    if (!userLocation && !isLoading && !error) {
      getCurrentLocation();
    }
  }, [userLocation, isLoading, error, getCurrentLocation]);

  return {
    userLocation,
    isLoading,
    error,
    hasPermission,
    getCurrentLocation,
    clearError,
  };
};
