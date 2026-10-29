import { useCallback, useEffect, useRef, useState } from 'react';
import * as Location from 'expo-location';
import type { LocationResult } from '~/domain/location/models';
import { NICARAGUA_DEPARTMENTS } from '~/domain/location/models';

const MIN_GEOCODE_QUERY_LENGTH = 3;
const GEOCODE_DEBOUNCE_MS = 400;

function searchInCities(query: string): LocationResult[] {
  const normalizedQuery = query.toLowerCase().trim();

  return NICARAGUA_DEPARTMENTS.filter(
    (city) =>
      city.name.toLowerCase().includes(normalizedQuery) ||
      city.address.toLowerCase().includes(normalizedQuery),
  );
}

// El geocoder no se limita a un país: cada resultado se confirma con su
// dirección real y se descarta si no está en Nicaragua. Las consultas van en
// serie porque iOS admite una sola geocodificación a la vez.
async function searchWithGeocoding(query: string): Promise<LocationResult[]> {
  try {
    const geocodeResults = await Location.geocodeAsync(query);
    const places: LocationResult[] = [];
    for (const [index, coordinates] of geocodeResults.slice(0, 5).entries()) {
      const [place] = await Location.reverseGeocodeAsync(coordinates);
      if (place?.isoCountryCode !== 'NI') continue;
      const name = place.city ?? place.subregion ?? place.name ?? query;
      places.push({
        id: `geocode_${index}`,
        name,
        address: [...new Set([name, place.region, place.country])]
          .filter(Boolean)
          .join(', '),
        coordinates: {
          latitude: coordinates.latitude,
          longitude: coordinates.longitude,
        },
      });
    }
    return places;
  } catch {
    return [];
  }
}

export const useLocationSearch = () => {
  const [searchResults, setSearchResults] = useState<LocationResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  // Evita que una respuesta de geocoding vieja pise a la búsqueda actual.
  const latestQuery = useRef('');
  const debounceTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(debounceTimer.current), []);

  const setSearchQuery = useCallback((query: string) => {
    const trimmed = query.trim();
    latestQuery.current = trimmed;
    clearTimeout(debounceTimer.current);

    if (!trimmed) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    const cityResults = searchInCities(trimmed);
    if (cityResults.length > 0 || trimmed.length < MIN_GEOCODE_QUERY_LENGTH) {
      setSearchResults(cityResults);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    debounceTimer.current = setTimeout(async () => {
      const geocodeResults = await searchWithGeocoding(trimmed);
      if (latestQuery.current !== trimmed) return;
      setSearchResults(geocodeResults);
      setIsSearching(false);
    }, GEOCODE_DEBOUNCE_MS);
  }, []);

  return {
    searchResults,
    isSearching,
    setSearchQuery,
    departmentCapitals: NICARAGUA_DEPARTMENTS,
  };
};
