import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import { QueryClient } from '@tanstack/react-query';
import { mmkvStorageAdapter } from '~/infrastructure/storage/mmkv';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      retry: 3,
      networkMode: 'online',
    },
    mutations: {
      retry: 1,
    },
  },
});

/**
 * Versión del caché persistido: súbela cuando cambie la forma de los datos
 * guardados (p. ej. un campo nuevo en GasStation) para descartar el caché viejo.
 */
export const QUERY_CACHE_BUSTER = '2';

export const queryPersister = createAsyncStoragePersister({
  storage: mmkvStorageAdapter,
  key: 'GAS_STATION_QUERY_CACHE',
});
