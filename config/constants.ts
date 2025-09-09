export const MAP_CONFIG = {
  MANAGUA_COORDINATES: {
    latitude: 12.1364,
    longitude: -86.2514,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  },
  DEFAULT_RADIUS: 10000, // 10km
} as const;

export const QUERY_CONFIG = {
  STALE_TIME: 30 * 60 * 1000, // 30 minutes - Gas stations don't change frequently
  GC_TIME: 2 * 60 * 60 * 1000, // 2 hours - Keep in cache longer
  RETRY_ATTEMPTS: 2, // Reduce retry attempts
  RETRY_DELAY: (attemptIndex: number) =>
    Math.min(1000 * 2 ** attemptIndex, 10000), // Max 10 seconds
} as const;

export const COLORS = {
  PRIMARY: '#22C55E',
  ERROR: '#ef4444',
  WARNING: '#fbbf24',
  GRAY: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },
} as const;
