import { useEffect } from 'react';
import {
  keepPreviousData,
  useQuery,
  useQueryClient,
  type QueryObserverResult,
} from '@tanstack/react-query';
import { findNearbyGasStations } from '~/application/gasStation/findNearbyGasStations';
import { gasStationRepository } from '~/composition/gasStation';
import { MAP_CONFIG, QUERY_CONFIG } from '~/shared/constants';
import type { Coordinates, GasStation } from '~/domain/gasStation/models';
import { useCurrentLocation } from '~/presentation/stores/locationStore';

// ~1 km: cada lectura del GPS varía en los últimos decimales; sin redondear,
// la clave cambia en cada arranque y el caché persistido nunca se reutiliza.
const roundForKey = (value: number) => Math.round(value * 100) / 100;

export const gasStationKeys = {
  all: ['gasStations'] as const,
  lists: () => [...gasStationKeys.all, 'list'] as const,
  detail: (id: string) => [...gasStationKeys.all, 'detail', id] as const,
  list: (location: Coordinates | null) =>
    location
      ? ([
          ...gasStationKeys.lists(),
          roundForKey(location.latitude),
          roundForKey(location.longitude),
        ] as const)
      : ([...gasStationKeys.lists(), 'no-location'] as const),
} as const;

interface UseGasStationsReturn {
  gasStations: GasStation[];
  isLoading: boolean;
  /** Se muestra la lista de la ubicación anterior mientras llega la nueva. */
  isShowingPrevious: boolean;
  error: Error | null;
  refetch: () => Promise<QueryObserverResult<GasStation[]>>;
}

export const useGasStations = (): UseGasStationsReturn => {
  const currentLocation = useCurrentLocation();

  const {
    data: gasStations = [],
    isLoading,
    isPlaceholderData,
    error,
    refetch,
  } = useQuery<GasStation[]>({
    queryKey: gasStationKeys.list(currentLocation),
    queryFn: async (): Promise<GasStation[]> => {
      if (!currentLocation) {
        throw new Error('Ubicación no disponible');
      }

      return findNearbyGasStations(gasStationRepository, {
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
        radius: MAP_CONFIG.DEFAULT_RADIUS,
      });
    },
    enabled: !!currentLocation,
    // Al cambiar de ciudad se mantiene la lista anterior en vez de un spinner.
    placeholderData: keepPreviousData,
    staleTime: QUERY_CONFIG.STALE_TIME,
    gcTime: QUERY_CONFIG.GC_TIME,
    retry: QUERY_CONFIG.RETRY_ATTEMPTS,
    retryDelay: QUERY_CONFIG.RETRY_DELAY,
    networkMode: 'online',
  });

  return {
    gasStations,
    isLoading,
    isShowingPrevious: isPlaceholderData,
    error: error as Error | null,
    refetch,
  };
};

/**
 * Recarga las listas cuando el repositorio trae más datos en segundo plano
 * (en iOS, el barrido de MapKit). Se monta una sola vez, en el layout de tabs.
 */
export function useGasStationsSync() {
  const queryClient = useQueryClient();

  useEffect(
    () =>
      gasStationRepository.subscribe?.(() => {
        queryClient.invalidateQueries({ queryKey: gasStationKeys.lists() });
      }),
    [queryClient],
  );
}

/**
 * Una estación por id. Primero la busca en las listas ya cargadas (render
 * inmediato); si no está (caché vencido, deep link en arranque en frío),
 * la pide al repositorio.
 */
export const useGasStation = (id: string | undefined) => {
  const queryClient = useQueryClient();
  const currentLocation = useCurrentLocation();

  const findInLists = () => {
    for (const [, data] of queryClient.getQueriesData<GasStation[]>({
      queryKey: gasStationKeys.lists(),
    })) {
      const found = data?.find((station) => station.id === id);
      if (found) return found;
    }
    return undefined;
  };

  const { data, isLoading } = useQuery<GasStation>({
    queryKey: gasStationKeys.detail(id ?? ''),
    queryFn: async () => {
      const station =
        findInLists() ??
        (await gasStationRepository.findById?.(
          id!,
          currentLocation ?? undefined,
        ));
      // Un error (y no `null`) para que "no encontrada" no quede persistida.
      if (!station) throw new Error('Gasolinera no encontrada');
      return station;
    },
    initialData: findInLists,
    enabled: !!id,
    // Los datos de una estación no cambian mientras se ve el detalle.
    staleTime: Infinity,
    retry: false,
    networkMode: 'always',
    // Se reconstruye al instante desde las listas o el repositorio.
    meta: { persist: false },
  });

  return { station: data ?? null, isLoading: !!id && isLoading };
};
