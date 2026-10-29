import { create } from 'zustand';
import * as Location from 'expo-location';
import type { Coordinates } from '~/domain/gasStation/models';
import type { SelectedLocation } from '~/domain/location/models';

/** `denied`: el usuario negó el permiso; `unavailable`: el GPS falló. */
export type LocationError = 'denied' | 'unavailable';

interface LocationState {
  userLocation: Coordinates | null;
  selectedLocation: SelectedLocation | null;
  isLoading: boolean;
  error: LocationError | null;
}

interface LocationActions {
  setSelectedLocation: (location: SelectedLocation | null) => void;
  getCurrentLocation: () => Promise<void>;
}

export type LocationStore = LocationState & LocationActions;

export const useLocationStore = create<LocationStore>((set, get) => ({
  userLocation: null,
  selectedLocation: null,
  isLoading: false,
  error: null,

  setSelectedLocation: (location) => {
    set({ selectedLocation: location });
  },

  getCurrentLocation: async () => {
    try {
      set({ isLoading: true, error: null });

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        set({ error: 'denied' });
        return;
      }

      // La última posición conocida es instantánea: deja pintar la lista
      // guardada en caché mientras el GPS obtiene una lectura fresca.
      const lastKnown = await Location.getLastKnownPositionAsync();
      if (lastKnown) {
        set({
          userLocation: {
            latitude: lastKnown.coords.latitude,
            longitude: lastKnown.coords.longitude,
          },
          isLoading: false,
        });
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
      // Con una posición previa ya en pantalla, un fallo del GPS no la tapa.
      if (get().userLocation) return;
      set({ error: 'unavailable' });
    } finally {
      set({ isLoading: false });
    }
  },
}));

export const useCurrentLocation = () =>
  useLocationStore((state) => state.selectedLocation || state.userLocation);
