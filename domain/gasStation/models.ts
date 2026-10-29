import type { DepartmentId } from '~/domain/location/departments';

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface GasStation {
  id: string;
  name: string;
  brand?: string;
  address: string;
  coordinates: Coordinates;
  /** Departamento donde está la estación (si la fuente lo permite saber). */
  department?: DepartmentId;
  /** Distancia en metros desde el punto de búsqueda. */
  distance?: number;
  amenities: string[];
  /** `undefined` cuando Google no reporta el horario. */
  isOpen?: boolean;
  rating?: number;
}
