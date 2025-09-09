import { create } from 'zustand';
import * as Location from 'expo-location';

interface LocationState {
  userLocation: {
    latitude: number;
    longitude: number;
  } | null;
  selectedLocation: {
    latitude: number;
    longitude: number;
    name: string;
    address: string;
  } | null;
  address: string | null;
  isLoading: boolean;
  error: string | null;
  hasPermission: boolean;
  showLocationModal: boolean;
}

interface LocationActions {
  setUserLocation: (
    location: { latitude: number; longitude: number } | null,
  ) => void;
  setSelectedLocation: (location: {
    latitude: number;
    longitude: number;
    name: string;
    address: string;
  } | null) => void;
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

type LocationStore = LocationState & LocationActions;

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
    } catch {
      set({ error: 'Error al obtener la ubicación actual' });
    } finally {
      set({ isLoading: false });
    }
  },
}));
