import { useCallback, useMemo, useState } from 'react';
import * as Location from 'expo-location';
import type { LocationResult } from '~/domain/location/models';
import { NICARAGUA_DEPARTMENTS } from '~/domain/location/models';

interface UseLocationSearchReturn {
  searchQuery: string;
  searchResults: LocationResult[];
  isSearching: boolean;
  setSearchQuery: (query: string) => void;
  clearSearch: () => void;
  popularCities: LocationResult[];
}

const MIN_QUERY_LENGTH = 3;

export const useLocationSearch = (): UseLocationSearchReturn => {
  const [searchQuery, setSearchQueryState] = useState('');
  const [searchResults, setSearchResults] = useState<LocationResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const popularCities = useMemo(() => NICARAGUA_DEPARTMENTS, []);

  const searchInCities = useCallback(
    (query: string): LocationResult[] => {
      const normalizedQuery = query.toLowerCase().trim();
      return popularCities.filter(
        (city) =>
          city.name.toLowerCase().includes(normalizedQuery) ||
          city.address.toLowerCase().includes(normalizedQuery),
      );
    },
    [popularCities],
  );

  const searchWithGeocoding = useCallback(
    async (query: string): Promise<LocationResult[]> => {
      try {
        const geocodeResults = await Location.geocodeAsync(query);
        return geocodeResults.map((result, index) => ({
          id: `geocode_${index}`,
          name: query,
          address: `${query}, Nicaragua`,
          coordinates: {
            latitude: result.latitude,
            longitude: result.longitude,
          },
        }));
      } catch {
        return [];
      }
    },
    [],
  );

  const performSearch = useCallback(
    async (query: string) => {
      if (!query.trim()) {
        setSearchResults([]);
        return;
      }

      setIsSearching(true);

      try {
        const cityResults = searchInCities(query);

        if (cityResults.length > 0) {
          setSearchResults(cityResults);
        } else if (query.length >= MIN_QUERY_LENGTH) {
          const geocodeResults = await searchWithGeocoding(query);
          setSearchResults(geocodeResults);
        } else {
          setSearchResults([]);
        }
      } catch {
        const fallbackResults = searchInCities(query);
        setSearchResults(fallbackResults);
      } finally {
        setIsSearching(false);
      }
    },
    [searchInCities, searchWithGeocoding],
  );

  const setSearchQuery = useCallback(
    (query: string) => {
      setSearchQueryState(query);
      performSearch(query);
    },
    [performSearch],
  );

  const clearSearch = useCallback(() => {
    setSearchQueryState('');
    setSearchResults([]);
  }, []);

  return {
    searchQuery,
    searchResults,
    isSearching,
    setSearchQuery,
    clearSearch,
    popularCities,
  };
};
