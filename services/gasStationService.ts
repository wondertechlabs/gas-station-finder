import { GasStation, FuelType, NICARAGUA_GAS_BRANDS } from '@/types/gasStation';

class GasStationServiceClass {
  private apiKey: string = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY || '';
  private baseUrl: string = 'https://maps.googleapis.com/maps/api/place';

  async findNearby(
    latitude: number,
    longitude: number,
    radius: number = 5000
  ): Promise<GasStation[]> {
    try {
      // For development, return mock data
      if (__DEV__) {
        return this.getMockGasStations(latitude, longitude);
      }

      const response = await fetch(
        `${this.baseUrl}/nearbysearch/json?` +
        `location=${latitude},${longitude}&` +
        `radius=${radius}&` +
        `type=gas_station&` +
        `key=${this.apiKey}&` +
        `language=es`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch gas stations');
      }

      const data = await response.json();
      return this.transformGooglePlacesToGasStations(data.results, latitude, longitude);
    } catch (error) {
      console.error('Error fetching gas stations:', error);
      // Return mock data as fallback
      return this.getMockGasStations(latitude, longitude);
    }
  }

  async getStationDetails(placeId: string): Promise<GasStation | null> {
    try {
      const response = await fetch(
        `${this.baseUrl}/details/json?` +
        `place_id=${placeId}&` +
        `fields=name,formatted_address,geometry,opening_hours,formatted_phone_number,rating&` +
        `key=${this.apiKey}&` +
        `language=es`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch station details');
      }

      const data = await response.json();
      return this.transformGooglePlaceToGasStation(data.result);
    } catch (error) {
      console.error('Error fetching station details:', error);
      return null;
    }
  }

  private transformGooglePlacesToGasStations(
    places: any[],
    userLat: number,
    userLon: number
  ): GasStation[] {
    return places.map(place => this.transformGooglePlaceToGasStation(place, userLat, userLon));
  }

  private transformGooglePlaceToGasStation(
    place: any,
    userLat?: number,
    userLon?: number
  ): GasStation {
    const coordinates = {
      latitude: place.geometry.location.lat,
      longitude: place.geometry.location.lng,
    };

    let distance: number | undefined;
    if (userLat && userLon) {
      distance = this.calculateDistance(
        userLat,
        userLon,
        coordinates.latitude,
        coordinates.longitude
      );
    }

    const brand = this.extractBrand(place.name);
    const fuelTypes = this.getDefaultFuelTypes();

    return {
      id: place.place_id || Math.random().toString(),
      name: place.name,
      brand,
      address: place.formatted_address || place.vicinity,
      coordinates,
      distance,
      fuelTypes,
      amenities: [],
      hours: this.parseOpeningHours(place.opening_hours),
      rating: place.rating,
      phone: place.formatted_phone_number,
      isOpen: place.opening_hours?.open_now,
      is24Hours: this.checkIf24Hours(place.opening_hours),
    };
  }

  private extractBrand(name: string): string | undefined {
    const upperName = name.toUpperCase();
    return NICARAGUA_GAS_BRANDS.find(brand => 
      upperName.includes(brand.toUpperCase())
    );
  }

  private getDefaultFuelTypes(): FuelType[] {
    return [
      {
        type: 'regular',
        displayName: 'Regular (87)',
        available: true,
        price: 35.50, // Mock price in NIO
      },
      {
        type: 'super',
        displayName: 'Súper (91)',
        available: true,
        price: 37.80,
      },
      {
        type: 'diesel',
        displayName: 'Diesel',
        available: true,
        price: 33.20,
      },
    ];
  }

  private parseOpeningHours(openingHours: any): any {
    // Simplified parsing - in real app would be more comprehensive
    return {
      monday: { open: '06:00', close: '22:00', closed: false },
      tuesday: { open: '06:00', close: '22:00', closed: false },
      wednesday: { open: '06:00', close: '22:00', closed: false },
      thursday: { open: '06:00', close: '22:00', closed: false },
      friday: { open: '06:00', close: '22:00', closed: false },
      saturday: { open: '06:00', close: '22:00', closed: false },
      sunday: { open: '07:00', close: '21:00', closed: false },
    };
  }

  private checkIf24Hours(openingHours: any): boolean {
    return openingHours?.periods?.[0]?.open?.time === '0000' &&
           openingHours?.periods?.[0]?.close?.time === '0000';
  }

  private calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371000; // Earth's radius in meters
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  // Mock data for development
  private getMockGasStations(latitude: number, longitude: number): GasStation[] {
    const mockStations: GasStation[] = [
      {
        id: '1',
        name: 'Shell Carretera Masaya',
        brand: 'Shell',
        address: 'Carretera Masaya, Km 7.5, Managua',
        coordinates: { latitude: 12.1234, longitude: -86.2456 },
        fuelTypes: this.getDefaultFuelTypes(),
        amenities: [
          { type: 'store', name: 'Tienda', available: true },
          { type: 'restroom', name: 'Servicios', available: true },
          { type: 'atm', name: 'ATM', available: true },
        ],
        hours: this.parseOpeningHours(null),
        rating: 4.2,
        phone: '+505 2277-3344',
        isOpen: true,
        is24Hours: true,
      },
      {
        id: '2',
        name: 'Petronic Plaza Inter',
        brand: 'Petronic',
        address: 'Plaza Inter, Carretera Sur, Managua',
        coordinates: { latitude: 12.1156, longitude: -86.2398 },
        fuelTypes: this.getDefaultFuelTypes(),
        amenities: [
          { type: 'store', name: 'Tienda', available: true },
          { type: 'car_wash', name: 'Lavado', available: true },
        ],
        hours: this.parseOpeningHours(null),
        rating: 4.0,
        phone: '+505 2268-1122',
        isOpen: true,
        is24Hours: false,
      },
      {
        id: '3',
        name: 'UNO Gas Centroamérica',
        brand: 'UNO Gas',
        address: 'Carretera Norte, Km 5, Managua',
        coordinates: { latitude: 12.1456, longitude: -86.2534 },
        fuelTypes: this.getDefaultFuelTypes(),
        amenities: [
          { type: 'store', name: 'Tienda', available: true },
          { type: 'restroom', name: 'Servicios', available: true },
        ],
        hours: this.parseOpeningHours(null),
        rating: 3.8,
        phone: '+505 2249-5566',
        isOpen: false,
        is24Hours: false,
      },
    ];

    // Calculate distances
    return mockStations.map(station => ({
      ...station,
      distance: this.calculateDistance(
        latitude,
        longitude,
        station.coordinates.latitude,
        station.coordinates.longitude
      )
    })).sort((a, b) => (a.distance || 0) - (b.distance || 0));
  }
}

export const GasStationService = new GasStationServiceClass();