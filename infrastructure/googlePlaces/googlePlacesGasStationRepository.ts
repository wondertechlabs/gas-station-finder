import type {
  GasStationRepository,
  FindNearbyGasStationsParams,
} from '~/domain/gasStation/repository';
import type {
  FuelType,
  FuelTypeName,
  GasStation,
} from '~/domain/gasStation/models';
import { isWithinNicaraguaBounds } from '~/domain/geo/nicaragua';
import { GooglePlacesClient } from './googlePlacesClient';
import type { GooglePlaceResult } from './types';

type BrandName =
  | 'Puma Energy'
  | 'DNP Petronic'
  | 'UNO'
  | 'Shell'
  | 'Texaco'
  | 'Esso'
  | 'Independiente'
  | 'Local';

function determineBrand(name: string): BrandName {
  const nameLower = name.toLowerCase();

  if (nameLower.includes('puma')) return 'Puma Energy';
  if (nameLower.includes('petronic') || nameLower.includes('dnp'))
    return 'DNP Petronic';
  if (nameLower.includes('uno')) return 'UNO';
  if (nameLower.includes('shell')) return 'Shell';
  if (nameLower.includes('texaco')) return 'Texaco';
  if (nameLower.includes('esso') || nameLower.includes('exxon')) return 'Esso';
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

function generateFuelPrices(brand: BrandName): FuelType[] {
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

function generateAmenities(types: string[]): string[] {
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

function generatePhoneNumber(): string {
  const areaCodes = ['505'];
  const areaCode = areaCodes[Math.floor(Math.random() * areaCodes.length)];
  const number = Math.floor(Math.random() * 90000000) + 10000000;
  return `+${areaCode} ${number}`;
}

function mapPlaceToGasStation(place: GooglePlaceResult): GasStation {
  const brand = determineBrand(place.name);
  const fuelTypes = generateFuelPrices(brand);
  const amenities = generateAmenities(place.types);
  const address =
    place.formatted_address || place.vicinity || 'Dirección no disponible';

  return {
    id: place.place_id,
    name: place.name,
    brand,
    address,
    coordinates: {
      latitude: place.geometry.location.lat,
      longitude: place.geometry.location.lng,
    },
    rating: place.rating || Math.random() * 2 + 3,
    isOpen: place.opening_hours?.open_now ?? Math.random() > 0.2,
    is24Hours: Math.random() > 0.7,
    phone: generatePhoneNumber(),
    fuelTypes,
    amenities,
    distance: Math.random() * 5 + 0.1,
  };
}

export class GooglePlacesGasStationRepository implements GasStationRepository {
  async findNearby(params: FindNearbyGasStationsParams): Promise<GasStation[]> {
    const { response, data } = await GooglePlacesClient.nearbyGasStations({
      latitude: params.latitude,
      longitude: params.longitude,
      radius: params.radius,
      language: 'es',
      region: 'ni',
    });

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

    // Nearby Search no ofrece filtro por país, así que filtramos por geofence.
    const onlyGasStationsInNicaragua = data.results.filter((place) => {
      const isGasStation = place.types.includes('gas_station');
      const inNicaragua = isWithinNicaraguaBounds(place.geometry.location);
      return isGasStation && inNicaragua;
    });

    return onlyGasStationsInNicaragua.map(mapPlaceToGasStation);
  }
}
