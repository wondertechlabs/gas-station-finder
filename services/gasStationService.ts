import { GasStation, FuelType } from '~/types/gasStation';

class GasStationServiceClass {
  getMockGasStations(): GasStation[] {
    return [
      {
        id: '1',
        name: 'Shell Carretera Masaya',
        brand: 'Shell',
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
        name: 'Petronic Plaza Inter',
        brand: 'Petronic',
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
      {
        id: '4',
        name: 'Texaco Metrocentro',
        brand: 'Texaco',
        address: 'Frente a Metrocentro, Managua',
        coordinates: { latitude: 12.1364, longitude: -86.2514 },
        fuelTypes: [
          { type: 'regular', price: 35.40, displayName: 'Regular (87)' },
          { type: 'super', price: 37.70, displayName: 'Súper (91)' },
          { type: 'diesel', price: 33.10, displayName: 'Diesel' },
        ],
        amenities: ['Tienda', 'Servicios', 'ATM', 'Lavado'],
        isOpen: true,
        is24Hours: true,
        rating: 4.3,
        phone: '+505 2255-7788',
      },
      {
        id: '5',
        name: 'Puma Carretera Norte',
        brand: 'Puma',
        address: 'Carretera Norte, Km 3, Managua',
        coordinates: { latitude: 12.1523, longitude: -86.2489 },
        fuelTypes: [
          { type: 'regular', price: 35.60, displayName: 'Regular (87)' },
          { type: 'super', price: 37.90, displayName: 'Súper (91)' },
          { type: 'diesel', price: 33.30, displayName: 'Diesel' },
        ],
        amenities: ['Tienda', 'Servicios'],
        isOpen: true,
        is24Hours: false,
        rating: 4.1,
        phone: '+505 2244-9900',
      },
      {
        id: '6',
        name: 'Esso Carretera Sur',
        brand: 'Esso',
        address: 'Carretera Sur, Km 2, Managua',
        coordinates: { latitude: 12.1089, longitude: -86.2345 },
        fuelTypes: [
          { type: 'regular', price: 35.45, displayName: 'Regular (87)' },
          { type: 'super', price: 37.75, displayName: 'Súper (91)' },
          { type: 'diesel', price: 33.15, displayName: 'Diesel' },
        ],
        amenities: ['Tienda', 'Servicios', 'ATM'],
        isOpen: true,
        is24Hours: true,
        rating: 4.0,
        phone: '+505 2266-1122',
      },
      {
        id: '7',
        name: 'Petronic Villa Fontana',
        brand: 'Petronic',
        address: 'Villa Fontana, Managua',
        coordinates: { latitude: 12.1289, longitude: -86.2678 },
        fuelTypes: [
          { type: 'regular', price: 35.35, displayName: 'Regular (87)' },
          { type: 'super', price: 37.65, displayName: 'Súper (91)' },
          { type: 'diesel', price: 33.05, displayName: 'Diesel' },
        ],
        amenities: ['Tienda', 'Lavado'],
        isOpen: true,
        is24Hours: false,
        rating: 3.9,
        phone: '+505 2233-4455',
      },
      {
        id: '8',
        name: 'Shell Las Colinas',
        brand: 'Shell',
        address: 'Las Colinas, Managua',
        coordinates: { latitude: 12.1423, longitude: -86.2789 },
        fuelTypes: [
          { type: 'regular', price: 35.55, displayName: 'Regular (87)' },
          { type: 'super', price: 37.85, displayName: 'Súper (91)' },
          { type: 'diesel', price: 33.25, displayName: 'Diesel' },
        ],
        amenities: ['Tienda', 'Servicios', 'ATM', 'Lavado'],
        isOpen: true,
        is24Hours: true,
        rating: 4.4,
        phone: '+505 2277-8899',
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