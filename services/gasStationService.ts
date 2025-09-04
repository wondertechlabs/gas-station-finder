import { GasStation, FuelType } from '@/types/gasStation';

class GasStationServiceClass {
  getMockGasStations(): GasStation[] {
    return [
      {
        id: '1',
        name: 'Puma Carretera Masaya',
        brand: 'Puma',
        address: 'Carretera Masaya, Km 7.5, Managua',
        coordinates: { latitude: 12.1234, longitude: -86.2456 },
        fuelTypes: [
          { type: 'regular', price: 35.50, displayName: 'Regular (87)' },
          { type: 'super', price: 37.80, displayName: 'Súper (91)' },
          { type: 'diesel', price: 33.20, displayName: 'Diesel' },
        ],
        amenities: ['Tienda', 'Servicios', 'ATM'],
        isOpen: true,
        is24Hours: true,
        rating: 4.2,
        phone: '+505 2277-3344',
      },
      {
        id: '2',
        name: 'UNO Gas Plaza Inter',
        brand: 'UNO Gas',
        address: 'Plaza Inter, Carretera Sur, Managua',
        coordinates: { latitude: 12.1156, longitude: -86.2398 },
        fuelTypes: [
          { type: 'regular', price: 35.30, displayName: 'Regular (87)' },
          { type: 'super', price: 37.60, displayName: 'Súper (91)' },
          { type: 'diesel', price: 33.00, displayName: 'Diesel' },
        ],
        amenities: ['Tienda', 'Lavado'],
        isOpen: true,
        is24Hours: false,
        rating: 4.0,
        phone: '+505 2268-1122',
      },
      {
        id: '3',
        name: 'UNO Gas Centroamérica',
        brand: 'UNO Gas',
        address: 'Carretera Norte, Km 5, Managua',
        coordinates: { latitude: 12.1456, longitude: -86.2534 },
        fuelTypes: [
          { type: 'regular', price: 35.70, displayName: 'Regular (87)' },
          { type: 'super', price: 38.00, displayName: 'Súper (91)' },
          { type: 'diesel', price: 33.40, displayName: 'Diesel' },
        ],
        amenities: ['Tienda', 'Servicios'],
        isOpen: false,
        is24Hours: false,
        rating: 3.8,
        phone: '+505 2249-5566',
      },
    ];
  }

  async findNearby(): Promise<GasStation[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    return this.getMockGasStations();
  }
}

export const GasStationService = new GasStationServiceClass();