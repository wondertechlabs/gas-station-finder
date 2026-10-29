import type { GasStationRepository } from '~/domain/gasStation/repository';
import { MapKitGasStationRepository } from '~/infrastructure/mapkit/mapKitGasStationRepository';

// En iOS las gasolineras vienen de MapKit: sin API key de Google.
export const gasStationRepository: GasStationRepository =
  new MapKitGasStationRepository();
