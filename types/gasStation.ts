export interface GasStation {
  id: string;
  name: string;
  brand?: string;
  address: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  distance?: number; // in meters
  fuelTypes: FuelType[];
  amenities: Amenity[];
  hours: Hours;
  rating?: number;
  priceRange?: PriceRange;
  phone?: string;
  isOpen?: boolean;
  is24Hours: boolean;
}

export interface FuelType {
  type: 'regular' | 'super' | 'diesel' | 'glp';
  price?: number; // NIO per liter
  available: boolean;
  displayName: string;
}

export interface Amenity {
  type: string;
  name: string;
  available: boolean;
}

export interface Hours {
  monday: DayHours;
  tuesday: DayHours;
  wednesday: DayHours;
  thursday: DayHours;
  friday: DayHours;
  saturday: DayHours;
  sunday: DayHours;
}

export interface DayHours {
  open: string;
  close: string;
  closed: boolean;
}

export interface PriceRange {
  min: number;
  max: number;
  currency: 'NIO';
}

export const NICARAGUA_GAS_BRANDS = [
  'Petronic',
  'Shell',
  'Texaco',
  'UNO Gas',
  'Puma',
  'Esso',
] as const;

export const FUEL_TYPE_NAMES = {
  regular: 'Regular (87)',
  super: 'Súper (91)',
  diesel: 'Diesel',
  glp: 'GLP',
} as const;