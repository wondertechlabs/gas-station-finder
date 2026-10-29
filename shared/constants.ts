export const MAP_CONFIG = {
  MANAGUA_COORDINATES: {
    latitude: 12.1364,
    longitude: -86.2514,
  },
  DEFAULT_ZOOM: 13,
  DETAIL_ZOOM: 16,
  DEFAULT_RADIUS: 10000,
} as const;

export const QUERY_CONFIG = {
  STALE_TIME: 30 * 60 * 1000,
  GC_TIME: 2 * 60 * 60 * 1000,
  RETRY_ATTEMPTS: 2,
  RETRY_DELAY: (attemptIndex: number) =>
    Math.min(1000 * 2 ** attemptIndex, 10000),
} as const;

export const COLORS = {
  PRIMARY: '#142968',
} as const;
