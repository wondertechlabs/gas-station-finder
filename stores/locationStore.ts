import { create } from 'zustand';
import * as Location from 'expo-location';

interface LocationState {
  userLocation: {
    latitude: number;
    longitude: number;
  } | null;
  address: string | null;
  isLoading: boolean;
  error: string | null;
  hasPermission: boolean;
}

interface LocationActions {
  setUserLocation: (
    location: { latitude: number; longitude: number } | null,
  ) => void;
  setAddress: (address: string | null) => void;
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
  address: null,
  isLoading: false,
  error: null,
  hasPermission: false,

  setUserLocation: (location) => {
    set({ userLocation: location });
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

      // Get address from coordinates
      try {
        const addressResponse = await Location.reverseGeocodeAsync(coords);
        if (addressResponse.length > 0) {
          const address = addressResponse[0];
          const addressString = [
            address.street,
            address.district,
            address.city,
            address.region,
            address.country,
          ]
            .filter(Boolean)
            .join(', ');
          set({ address: addressString });
        }
      } catch (addressError) {
        console.log('Error getting address:', addressError);
        set({ address: 'Ubicación actual' });
      }
    } catch {
      set({ error: 'Error al obtener la ubicación actual' });
    } finally {
      set({ isLoading: false });
    }
  },
}));
