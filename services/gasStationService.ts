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
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'No se pudieron cargar las gasolineras';
      throw new Error(errorMessage);
    }
  }
}

export const GasStationService = new GasStationServiceClass();
