import { GasStation } from '~/types/gasStation';
import { GooglePlacesService } from './googlePlacesService';

class GasStationServiceClass {
  async findNearby(
    latitude: number = 12.1364,
    longitude: number = -86.2514,
    radius: number = 10000,
  ): Promise<GasStation[]> {
    try {
      return await GooglePlacesService.findGasStations(
        latitude,
        longitude,
        radius,
      );
    } catch {
      throw new Error('No se pudieron cargar las gasolineras');
    }
  }
}

export const GasStationService = new GasStationServiceClass();
