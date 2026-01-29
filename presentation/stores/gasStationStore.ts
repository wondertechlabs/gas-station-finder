import { create } from 'zustand';
import type { GasStation } from '~/domain/gasStation/models';

interface GasStationState {
  searchQuery: string;
  selectedStation: GasStation | null;
}

interface GasStationActions {
  setSearchQuery: (query: string) => void;
  setSelectedStation: (station: GasStation | null) => void;
  clearSelection: () => void;
}

type GasStationStore = GasStationState & GasStationActions;

export const useGasStationStore = create<GasStationStore>((set) => ({
  searchQuery: '',
  selectedStation: null,

  setSearchQuery: (query) => {
    set({ searchQuery: query });
  },

  setSelectedStation: (station) => {
    set({ selectedStation: station });
  },

  clearSelection: () => {
    set({ selectedStation: null });
  },
}));

export const useSearchQuery = () =>
  useGasStationStore((state) => state.searchQuery);

export const useSelectedStation = () =>
  useGasStationStore((state) => state.selectedStation);
