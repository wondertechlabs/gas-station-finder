import type { GasStation } from './models';

export interface FindNearbyGasStationsParams {
  latitude: number;
  longitude: number;
  radius: number;
}

export interface GasStationRepository {
  findNearby(params: FindNearbyGasStationsParams): Promise<GasStation[]>;
  /**
   * Avisa cuando el repositorio obtuvo datos nuevos en segundo plano
   * (p. ej. al terminar de cargar todo el país). Devuelve la función para desuscribirse.
   */
  subscribe?(listener: () => void): () => void;
}
