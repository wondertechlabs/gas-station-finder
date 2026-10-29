import type { GasStationRepository } from '~/domain/gasStation/repository';
import { GooglePlacesGasStationRepository } from '~/infrastructure/googlePlaces/googlePlacesGasStationRepository';

export const gasStationRepository: GasStationRepository =
  new GooglePlacesGasStationRepository();
