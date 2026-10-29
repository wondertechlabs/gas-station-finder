import { useEffect, useState } from 'react';
import * as Location from 'expo-location';
import type { Coordinates } from '~/domain/gasStation/models';

const formatCoordinates = ({ latitude, longitude }: Coordinates) =>
  `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;

async function resolveAddress(coordinates: Coordinates): Promise<string> {
  try {
    const [result] = await Location.reverseGeocodeAsync(coordinates);
    const parts = result
      ? [result.street, result.district, result.city, result.region].filter(
          (part): part is string => !!part,
        )
      : [];
    return parts.length > 0 ? parts.join(', ') : formatCoordinates(coordinates);
  } catch {
    return formatCoordinates(coordinates);
  }
}

/** Dirección legible para unas coordenadas; cae a las coordenadas si falla. */
export function useReverseGeocode(coordinates: Coordinates | null) {
  const [resolved, setResolved] = useState<{
    coordinates: Coordinates;
    address: string;
  } | null>(null);

  useEffect(() => {
    if (!coordinates) return;

    let cancelled = false;
    resolveAddress(coordinates).then((address) => {
      if (!cancelled) setResolved({ coordinates, address });
    });

    return () => {
      cancelled = true;
    };
  }, [coordinates]);

  const isCurrent = resolved !== null && resolved.coordinates === coordinates;
  return {
    address: isCurrent ? resolved.address : null,
    isLoading: coordinates !== null && !isCurrent,
  };
}
