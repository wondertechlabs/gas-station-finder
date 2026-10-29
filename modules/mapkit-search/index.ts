import { requireNativeModule } from 'expo';

export interface PointOfInterest {
  id: string;
  name: string;
  address?: string;
  /** Código ISO del país, p. ej. "NI". */
  countryCode?: string;
  /** Departamento según el sistema, en el idioma del dispositivo. */
  administrativeArea?: string;
  latitude: number;
  longitude: number;
}

/** Máximo de resultados que MapKit devuelve por búsqueda. */
export const MAPKIT_RESULT_LIMIT = 25;

/** Código del error cuando MapKit limita las búsquedas por minuto. */
export const MAPKIT_THROTTLED = 'ERR_MAPKIT_THROTTLED';

interface MapKitSearchModule {
  searchGasStationsInRegion(
    latitude: number,
    longitude: number,
    latitudeDelta: number,
    longitudeDelta: number,
  ): Promise<PointOfInterest[]>;
}

// Solo iOS: importar únicamente desde archivos `.ios.ts`.
export default requireNativeModule<MapKitSearchModule>('MapKitSearch');
