import { createMMKV } from 'react-native-mmkv';

export const storage = createMMKV({ id: 'gas-station-finder' });

/** Adaptador con la interfaz getItem/setItem/removeItem que esperan los persisters. */
export const mmkvStorageAdapter = {
  getItem: (key: string) => storage.getString(key) ?? null,
  setItem: (key: string, value: string) => storage.set(key, value),
  removeItem: (key: string) => {
    storage.remove(key);
  },
};
