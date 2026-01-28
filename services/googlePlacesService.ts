import { GasStation, FuelType, FuelTypeName } from '~/types/gasStation';

type LatLng = { lat: number; lng: number };

const NICARAGUA_BOUNDS = {
  minLat: 10.7,
  maxLat: 15.1,
  minLng: -87.8,
  maxLng: -82.6,
} as const;

function isWithinNicaraguaBounds(location: LatLng): boolean {
  return (
    location.lat >= NICARAGUA_BOUNDS.minLat &&
    location.lat <= NICARAGUA_BOUNDS.maxLat &&
    location.lng >= NICARAGUA_BOUNDS.minLng &&
    location.lng <= NICARAGUA_BOUNDS.maxLng
  );
}

interface GooglePlaceGeometry {
  location: LatLng;
}

interface GooglePlaceResult {
  place_id: string;
  name: string;
  formatted_address?: string;
  geometry: GooglePlaceGeometry;
  rating?: number;
  user_ratings_total?: number;
  opening_hours?: {
    open_now: boolean;
  };
  types: string[];
  vicinity?: string;
  business_status?: string;
}

type GooglePlacesStatus =
  | 'OK'
  | 'ZERO_RESULTS'
  | 'OVER_QUERY_LIMIT'
  | 'REQUEST_DENIED'
  | 'INVALID_REQUEST'
  | 'UNKNOWN_ERROR';

interface GooglePlacesResponse {
  results: GooglePlaceResult[];
  status: GooglePlacesStatus;
  error_message?: string;
}

interface GooglePlaceDetails {
  name: string;
  formatted_address: string;
  formatted_phone_number?: string;
  opening_hours?: {
    open_now: boolean;
    weekday_text?: string[];
  };
  rating?: number;
  user_ratings_total?: number;
  types: string[];
}

type BrandName =
  | 'Puma Energy'
  | 'DNP Petronic'
  | 'UNO'
  | 'Shell'
  | 'Texaco'
  | 'Esso'
  | 'Independiente'
  | 'Local';

export class GooglePlacesService {
  private static readonly API_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;
  private static readonly BASE_URL =
    'https://maps.googleapis.com/maps/api/place';

  static async testApiKey(): Promise<boolean> {
    if (!this.API_KEY) {
      return false;
    }

    try {
      const testUrl = `${this.BASE_URL}/nearbysearch/json?location=12.1364,-86.2514&radius=1000&type=gas_station&key=${this.API_KEY}&language=es&region=ni`;
      const response = await fetch(testUrl);
      const data = await response.json();
      return data.status === 'OK' || data.status === 'ZERO_RESULTS';
    } catch {
      return false;
    }
  }

  static async findGasStations(
    latitude: number,
    longitude: number,
    radius: number = 5000,
  ): Promise<GasStation[]> {
    if (!this.API_KEY) {
      throw new Error('Google Maps API Key not configured');
    }

    try {
      const url = `${this.BASE_URL}/nearbysearch/json?location=${latitude},${longitude}&radius=${radius}&type=gas_station&key=${this.API_KEY}&language=es&region=ni`;
      const response = await fetch(url);
      const data: GooglePlacesResponse = await response.json();

      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }

      if (data.status === 'ZERO_RESULTS') {
        return [];
      }

      if (data.status !== 'OK') {
        const msg = data.error_message ? ` - ${data.error_message}` : '';
        throw new Error(`Google Places API error: ${data.status}${msg}`);
      }

      const onlyGasStationsInNicaragua = data.results.filter((place) => {
        const isGasStation = place.types.includes('gas_station');
        const inNicaragua = isWithinNicaraguaBounds(place.geometry.location);
        return isGasStation && inNicaragua;
      });

      return this.transformGooglePlacesToGasStations(onlyGasStationsInNicaragua);
    } catch (error) {
      const errorMessage = error instanceof Error
        ? error.message
        : 'Error fetching gas stations from Google Places';
      throw new Error(errorMessage);
    }
  }

  static async getPlaceDetails(placeId: string): Promise<GooglePlaceDetails | null> {
    if (!this.API_KEY) {
      return null;
    }

    try {
      const url = `${this.BASE_URL}/details/json?place_id=${placeId}&fields=name,formatted_address,formatted_phone_number,opening_hours,rating,user_ratings_total,types&key=${this.API_KEY}`;

      const response = await fetch(url);
      const data = await response.json();

      return data.result;
    } catch {
      return null;
    }
  }

  private static transformGooglePlacesToGasStations(
    places: GooglePlaceResult[],
  ): GasStation[] {
    return places.map((place) => {
      const brand = this.determineBrand(place.name);
      const fuelTypes = this.generateFuelPrices(brand);
      const amenities = this.generateAmenities(place.types);
      const address =
        place.formatted_address ||
        place.vicinity ||
        'Dirección no disponible';

      return {
        id: place.place_id,
        name: place.name,
        brand: brand,
        address,
        coordinates: {
          latitude: place.geometry.location.lat,
          longitude: place.geometry.location.lng,
        },
        rating: place.rating || Math.random() * 2 + 3,
        isOpen: place.opening_hours?.open_now ?? Math.random() > 0.2,
        is24Hours: Math.random() > 0.7,
        phone: this.generatePhoneNumber(),
        fuelTypes: fuelTypes,
        amenities: amenities,
        distance: Math.random() * 5 + 0.1,
      };
    });
  }

  private static determineBrand(name: string): BrandName {
    const nameLower = name.toLowerCase();

    if (nameLower.includes('puma')) return 'Puma Energy';
    if (nameLower.includes('petronic') || nameLower.includes('dnp'))
      return 'DNP Petronic';
    if (nameLower.includes('uno')) return 'UNO';
    if (nameLower.includes('shell')) return 'Shell';
    if (nameLower.includes('texaco')) return 'Texaco';
    if (nameLower.includes('esso') || nameLower.includes('exxon'))
      return 'Esso';
    if (
      nameLower.includes('bandera blanca') ||
      nameLower.includes('independiente')
    )
      return 'Independiente';
    if (nameLower.includes('local') || nameLower.includes('privada'))
      return 'Local';

    const nicaraguaBrands: BrandName[] = [
      'Puma Energy',
      'DNP Petronic',
      'UNO',
      'Shell',
      'Texaco',
      'Esso',
      'Independiente',
      'Local',
    ];
    return nicaraguaBrands[Math.floor(Math.random() * nicaraguaBrands.length)];
  }

  private static generateFuelPrices(brand: BrandName): FuelType[] {
    const basePrices: Record<FuelTypeName, number> = {
      regular: 35.5,
      super: 37.2,
      diesel: 33.8,
      glp: 28.5,
    };

    const brandMultiplier: Record<BrandName, number> = {
      'Puma Energy': 1.02,
      Shell: 1.05,
      Texaco: 1.03,
      Esso: 1.02,
      'DNP Petronic': 0.98,
      UNO: 0.97,
      Independiente: 0.95,
      Local: 0.96,
    };

    const multiplier = brandMultiplier[brand] || 1.0;

    const fuelTypes: { type: FuelTypeName; displayName: string }[] = [
      { type: 'regular', displayName: 'Regular' },
      { type: 'super', displayName: 'Super' },
      { type: 'diesel', displayName: 'Diesel' },
    ];

    return fuelTypes.map((fuel) => ({
      type: fuel.type,
      displayName: fuel.displayName,
      price: Math.round(basePrices[fuel.type] * multiplier * 100) / 100,
    }));
  }

  private static generateAmenities(types: string[]): string[] {
    const amenities: string[] = [];

    if (types.includes('store')) amenities.push('Tienda');
    if (types.includes('restaurant')) amenities.push('Restaurante');
    if (types.includes('atm')) amenities.push('Cajero Automático');

    const additionalServices = [
      'Lavado de Auto',
      'Aire para Llantas',
      'Baños Públicos',
      'WiFi Gratis',
      'Estacionamiento',
      'Cafetería',
      'Farmacia',
    ];

    const numServices = Math.floor(Math.random() * 3) + 2;
    const shuffled = additionalServices.sort(() => 0.5 - Math.random());
    amenities.push(...shuffled.slice(0, numServices));

    return amenities;
  }

  private static generatePhoneNumber(): string {
    const areaCodes = ['505'];
    const areaCode = areaCodes[Math.floor(Math.random() * areaCodes.length)];
    const number = Math.floor(Math.random() * 90000000) + 10000000;
    return `+${areaCode} ${number}`;
  }
}
