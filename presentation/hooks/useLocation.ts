import { useEffect } from 'react';
import { useLocationStore } from '~/presentation/stores/locationStore';
import type { LocationStore } from '~/presentation/stores/locationStore';

interface UseLocationReturn {
  userLocation: LocationStore['userLocation'];
  selectedLocation: LocationStore['selectedLocation'];
  address: string | null;
  isLoading: boolean;
  error: string | null;
  hasPermission: boolean;
  showLocationModal: boolean;
  getCurrentLocation: () => Promise<void>;
  setSelectedLocation: (location: LocationStore['selectedLocation']) => void;
  clearSelectedLocation: () => void;
  setShowLocationModal: (show: boolean) => void;
  clearError: () => void;
}

export const useLocation = (): UseLocationReturn => {
  const userLocation = useLocationStore((state) => state.userLocation);
  const selectedLocation = useLocationStore((state) => state.selectedLocation);
  const address = useLocationStore((state) => state.address);
  const isLoading = useLocationStore((state) => state.isLoading);
  const error = useLocationStore((state) => state.error);
  const hasPermission = useLocationStore((state) => state.hasPermission);
  const showLocationModal = useLocationStore(
    (state) => state.showLocationModal,
  );
  const getCurrentLocation = useLocationStore(
    (state) => state.getCurrentLocation,
  );
  const setSelectedLocation = useLocationStore(
    (state) => state.setSelectedLocation,
  );
  const clearSelectedLocation = useLocationStore(
    (state) => state.clearSelectedLocation,
  );
  const setShowLocationModal = useLocationStore(
    (state) => state.setShowLocationModal,
  );
  const clearError = useLocationStore((state) => state.clearError);

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
