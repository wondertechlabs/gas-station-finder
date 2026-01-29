import type { GasStation } from './models';

export interface FindNearbyGasStationsParams {
  latitude: number;
  longitude: number;
  radius: number;
}

export interface GasStationRepository {
  findNearby(params: FindNearbyGasStationsParams): Promise<GasStation[]>;
}
