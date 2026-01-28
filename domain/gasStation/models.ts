export interface Coordinates {
  latitude: number;
  longitude: number;
}

export type FuelTypeName = 'regular' | 'super' | 'diesel' | 'glp';

export interface FuelType {
  type: FuelTypeName;
  price: number;
  displayName: string;
}

export interface GasStation {
  id: string;
  name: string;
  brand?: string;
  address: string;
  coordinates: Coordinates;
  distance?: number;
  fuelTypes: FuelType[];
  amenities: string[];
  isOpen: boolean;
  is24Hours: boolean;
  rating?: number;
  phone?: string;
  lastUpdated?: string;
}
