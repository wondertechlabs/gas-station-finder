export interface GasStation {
  id: string;
  name: string;
  brand?: string;
  address: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  distance?: number;
  fuelTypes: FuelType[];
  amenities: string[];
  isOpen: boolean;
  is24Hours: boolean;
  rating?: number;
  phone?: string;
}

export interface FuelType {
  type: 'regular' | 'super' | 'diesel' | 'glp';
  price: number;
  displayName: string;
}

export const NICARAGUA_GAS_BRANDS = ['Petronic', 'UNO Gas', 'Puma'] as const;
