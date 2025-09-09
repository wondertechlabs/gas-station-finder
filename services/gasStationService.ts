import { GasStation } from '~/types/gasStation';
import { GooglePlacesService } from './googlePlacesService';

class GasStationServiceClass {
  async findNearby(
    latitude: number = 12.1364,
    longitude: number = -86.2514,
    radius: number = 10000,
  ): Promise<GasStation[]> {
    try {
      const realGasStations = await GooglePlacesService.findGasStations(
        latitude,
        longitude,
        radius,
      );

      if (realGasStations.length > 0) {
        return realGasStations;
      }

      console.log('No se encontraron gasolineras reales de Google Places');
      return [];
    } catch (error) {
      console.error('Error fetching gas stations:', error);
      return [];
    }
  }
}

export const GasStationService = new GasStationServiceClass();
