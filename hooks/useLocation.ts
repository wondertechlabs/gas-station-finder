import { useEffect } from 'react';
import { useLocationStore } from '~/stores/locationStore';

export const useLocation = () => {
  const {
    userLocation,
    address,
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
    address,
    isLoading,
    error,
    hasPermission,
    getCurrentLocation,
    clearError,
  };
};
