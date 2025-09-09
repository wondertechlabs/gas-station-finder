import { useEffect } from 'react';
import { useLocationStore } from '~/stores/locationStore';

export const useLocation = () => {
  const {
    userLocation,
    selectedLocation,
    address,
    isLoading,
    error,
    hasPermission,
    showLocationModal,
    getCurrentLocation,
    setSelectedLocation,
    clearSelectedLocation,
    setShowLocationModal,
    clearError,
  } = useLocationStore();

  useEffect(() => {
    if (!userLocation && !isLoading && !error) {
      getCurrentLocation();
    }
  }, [userLocation, isLoading, error, getCurrentLocation]);

  return {
    userLocation,
    selectedLocation,
    address,
    isLoading,
    error,
    hasPermission,
    showLocationModal,
    getCurrentLocation,
    setSelectedLocation,
    clearSelectedLocation,
    setShowLocationModal,
    clearError,
  };
};
