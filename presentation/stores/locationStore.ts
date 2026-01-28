import { create } from 'zustand';
import * as Location from 'expo-location';
import type { Coordinates } from '~/domain/gasStation/models';
import type { SelectedLocation } from '~/domain/location/models';

interface LocationState {
  userLocation: Coordinates | null;
  selectedLocation: SelectedLocation | null;
  address: string | null;
  isLoading: boolean;
  error: string | null;
  hasPermission: boolean;
  showLocationModal: boolean;
}

interface LocationActions {
  setUserLocation: (location: Coordinates | null) => void;
  setSelectedLocation: (location: SelectedLocation | null) => void;
  clearSelectedLocation: () => void;
  setAddress: (address: string | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setHasPermission: (hasPermission: boolean) => void;
  requestLocationPermission: () => Promise<boolean>;
  getCurrentLocation: () => Promise<void>;
  clearError: () => void;
  setShowLocationModal: (show: boolean) => void;
}

export type LocationStore = LocationState & LocationActions;

export const useLocationStore = create<LocationStore>((set, get) => ({
  userLocation: null,
  selectedLocation: null,
  address: null,
  isLoading: false,
  error: null,
  hasPermission: false,
  showLocationModal: false,

  setUserLocation: (location) => {
    set({ userLocation: location });
  },

  setSelectedLocation: (location) => {
    set({ selectedLocation: location });
  },

  clearSelectedLocation: () => {
    set({ selectedLocation: null });
  },

  setAddress: (address) => {
    set({ address });
  },

  setLoading: (loading) => {
    set({ isLoading: loading });
  },

  setError: (error) => {
    set({ error });
  },

  setHasPermission: (hasPermission) => {
    set({ hasPermission });
  },

  clearError: () => {
    set({ error: null });
  },

  setShowLocationModal: (show) => {
    set({ showLocationModal: show });
  },

  requestLocationPermission: async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      const hasPermission = status === 'granted';
      set({ hasPermission });
      return hasPermission;
    } catch {
      set({ error: 'Error al solicitar permisos de ubicación' });
      return false;
    }
  },

  getCurrentLocation: async () => {
    try {
      set({ isLoading: true, error: null });

      const hasPermission = await get().requestLocationPermission();
      if (!hasPermission) {
        set({ error: 'Permisos de ubicación denegados' });
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const coords = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };

      set({ userLocation: coords });

      // Set a simple address without reverse geocoding to save API costs
      set({ address: 'Ubicación actual' });
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Error al obtener la ubicación actual';
      set({ error: errorMessage });
    } finally {
      set({ isLoading: false });
    }
  },
}));

// Selectors for better performance
export const useUserLocation = () =>
  useLocationStore((state) => state.userLocation);

export const useSelectedLocation = () =>
  useLocationStore((state) => state.selectedLocation);

export const useCurrentLocation = () =>
  useLocationStore((state) => state.selectedLocation || state.userLocation);

export const useLocationError = () => useLocationStore((state) => state.error);

export const useLocationLoading = () =>
  useLocationStore((state) => state.isLoading);
