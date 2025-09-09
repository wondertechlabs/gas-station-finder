import { create } from 'zustand';
import * as Location from 'expo-location';

interface LocationState {
  userLocation: {
    latitude: number;
    longitude: number;
  } | null;
  isLoading: boolean;
  error: string | null;
  hasPermission: boolean;
}

interface LocationActions {
  setUserLocation: (
    location: { latitude: number; longitude: number } | null,
  ) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setHasPermission: (hasPermission: boolean) => void;
  requestLocationPermission: () => Promise<boolean>;
  getCurrentLocation: () => Promise<void>;
  clearError: () => void;
}

type LocationStore = LocationState & LocationActions;

export const useLocationStore = create<LocationStore>((set, get) => ({
  userLocation: null,
  isLoading: false,
  error: null,
  hasPermission: false,

  setUserLocation: (location) => {
    set({ userLocation: location });
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

      set({
        userLocation: {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        },
      });
    } catch {
      set({ error: 'Error al obtener la ubicación actual' });
    } finally {
      set({ isLoading: false });
    }
  },
}));
