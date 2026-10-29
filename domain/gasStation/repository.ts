import type { Coordinates, GasStation } from './models';

export interface FindNearbyGasStationsParams {
  latitude: number;
  longitude: number;
  radius: number;
}

export interface GasStationRepository {
  findNearby(params: FindNearbyGasStationsParams): Promise<GasStation[]>;
  /**
   * Busca una estación ya conocida por su id (sin depender del caché de la UI).
   * Con `origin` se calcula la distancia. `null` si la fuente no la conoce.
   */
  findById?(id: string, origin?: Coordinates): Promise<GasStation | null>;
  /**
   * Avisa cuando el repositorio obtuvo datos nuevos en segundo plano
   * (p. ej. al terminar de cargar todo el país). Devuelve la función para desuscribirse.
   */
  subscribe?(listener: () => void): () => void;
}
