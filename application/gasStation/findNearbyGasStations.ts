import type { GasStation } from '~/domain/gasStation/models';
import type { GasStationRepository } from '~/domain/gasStation/repository';

export async function findNearbyGasStations(
  repo: GasStationRepository,
  params: { latitude: number; longitude: number; radius: number },
): Promise<GasStation[]> {
  return repo.findNearby(params);
}
