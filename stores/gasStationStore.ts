import { create } from 'zustand';
import { GasStation } from '~/types/gasStation';

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
