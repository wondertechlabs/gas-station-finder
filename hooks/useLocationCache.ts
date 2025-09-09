import { useState, useCallback } from 'react';
import * as Location from 'expo-location';
import { LocationResult, NICARAGUA_DEPARTMENTS } from '~/types/location';

export const useLocationCache = () => {
  const [searchResults, setSearchResults] = useState<LocationResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const searchLocation = useCallback(async (query: string): Promise<LocationResult[]> => {
    if (!query.trim()) {
      return [];
    }

    setIsSearching(true);
    
    try {
      // First, search in popular cities (no API cost)
      const filteredCities = NICARAGUA_DEPARTMENTS.filter(city =>
        city.name.toLowerCase().includes(query.toLowerCase()) ||
        city.address.toLowerCase().includes(query.toLowerCase())
      );

      if (filteredCities.length > 0) {
        // Use popular cities results (no API cost)
        setSearchResults(filteredCities);
        return filteredCities;
      } else {
        // Only use geocoding as last resort for very specific searches
        // Add minimum query length to reduce unnecessary API calls
        if (query.length >= 3) {
          const geocodeResults = await Location.geocodeAsync(query);
          const results: LocationResult[] = geocodeResults.map((result, index) => ({
            id: `geocode_${index}`,
            name: query,
            address: `${query}, Nicaragua`,
            coordinates: {
              latitude: result.latitude,
              longitude: result.longitude
            }
          }));
          setSearchResults(results);
          return results;
        } else {
          setSearchResults([]);
          return [];
        }
      }
    } catch (error) {
      console.log('Error searching location:', error);
      // Fallback to popular cities if geocoding fails
      const filteredCities = NICARAGUA_DEPARTMENTS.filter(city =>
        city.name.toLowerCase().includes(query.toLowerCase()) ||
        city.address.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(filteredCities);
      return filteredCities;
    } finally {
      setIsSearching(false);
    }
  }, []);

  const getPopularCities = useCallback(() => {
    return NICARAGUA_DEPARTMENTS;
  }, []);

  return {
    searchLocation,
    getPopularCities,
    searchResults,
    isSearching,
  };
};
