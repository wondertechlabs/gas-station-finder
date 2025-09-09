import { GasStation } from '~/types/gasStation';

interface GooglePlaceResult {
  place_id: string;
  name: string;
  formatted_address: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  rating?: number;
  user_ratings_total?: number;
  opening_hours?: {
    open_now: boolean;
  };
  types: string[];
  vicinity?: string;
  business_status?: string;
}

interface GooglePlacesResponse {
  results: GooglePlaceResult[];
  status: string;
}

export class GooglePlacesService {
  private static readonly API_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;
  private static readonly BASE_URL =
    'https://maps.googleapis.com/maps/api/place';

  static async testApiKey(): Promise<boolean> {
    if (!this.API_KEY) {
      console.log('No API Key found');
      return false;
    }

    try {
      const testUrl = `${this.BASE_URL}/nearbysearch/json?location=12.1364,-86.2514&radius=1000&type=gas_station&key=${this.API_KEY}`;
      const response = await fetch(testUrl);
      const data = await response.json();

      console.log('API Test Response:', data.status);
      return data.status === 'OK';
    } catch (error) {
      console.error('API Test Error:', error);
      return false;
    }
  }

  static async findGasStations(
    latitude: number,
    longitude: number,
    radius: number = 5000,
  ): Promise<GasStation[]> {
    if (!this.API_KEY) {
      console.warn('Google Maps API Key not found');
      console.log(
        'Para usar datos reales, configura EXPO_PUBLIC_GOOGLE_MAPS_API_KEY en tu archivo .env',
      );
      return [];
    }

    try {
      const url = `${this.BASE_URL}/nearbysearch/json?location=${latitude},${longitude}&radius=${radius}&type=gas_station&key=${this.API_KEY}`;

      const response = await fetch(url);
      const data: GooglePlacesResponse = await response.json();

      if (data.status !== 'OK') {
        console.error('Google Places API error:', data.status);
        if (data.status === 'REQUEST_DENIED') {
          console.error('API Key inválida o no configurada correctamente');
          console.log('API Key encontrada:', this.API_KEY ? 'Sí' : 'No');
          console.log(
            'Primeros 10 caracteres:',
            this.API_KEY?.substring(0, 10),
          );
          console.log('Verifica que:');
          console.log('1. Places API esté habilitada en Google Cloud Console');
          console.log('2. La API Key tenga permisos para Places API');
          console.log('3. No haya restricciones de IP o dominio');
        }
        return [];
      }

      return this.transformGooglePlacesToGasStations(data.results);
    } catch (error) {
      console.error('Error fetching gas stations from Google Places:', error);
      return [];
    }
  }

  static async getPlaceDetails(placeId: string): Promise<any> {
    if (!this.API_KEY) {
      return null;
    }

    try {
      const url = `${this.BASE_URL}/details/json?place_id=${placeId}&fields=name,formatted_address,formatted_phone_number,opening_hours,rating,user_ratings_total,types&key=${this.API_KEY}`;

      const response = await fetch(url);
      const data = await response.json();

      return data.result;
    } catch (error) {
      console.error('Error fetching place details:', error);
      return null;
    }
  }

  private static transformGooglePlacesToGasStations(
    places: GooglePlaceResult[],
  ): GasStation[] {
    return places.map((place, index) => {
      const brand = this.determineBrand(place.name);
      const fuelTypes = this.generateFuelPrices(brand);
      const amenities = this.generateAmenities(place.types);

      return {
        id: place.place_id,
        name: place.name,
        brand: brand,
        address:
          place.formatted_address ||
          place.vicinity ||
          'Dirección no disponible',
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

  private static determineBrand(name: string): string {
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

    const nicaraguaBrands = [
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

  private static generateFuelPrices(brand: string): any[] {
    const basePrices = {
      regular: 35.5,
      super: 37.2,
      diesel: 33.8,
      glp: 28.5,
    };

    const brandMultiplier = {
      'Puma Energy': 1.02,
      Shell: 1.05,
      Texaco: 1.03,
      Esso: 1.02,
      'DNP Petronic': 0.98,
      UNO: 0.97,
      Independiente: 0.95,
      Local: 0.96,
    };

    const multiplier =
      brandMultiplier[brand as keyof typeof brandMultiplier] || 1.0;

    return [
      {
        type: 'regular',
        displayName: 'Regular',
        price: Math.round(basePrices.regular * multiplier * 100) / 100,
      },
      {
        type: 'super',
        displayName: 'Super',
        price: Math.round(basePrices.super * multiplier * 100) / 100,
      },
      {
        type: 'diesel',
        displayName: 'Diesel',
        price: Math.round(basePrices.diesel * multiplier * 100) / 100,
      },
    ];
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
