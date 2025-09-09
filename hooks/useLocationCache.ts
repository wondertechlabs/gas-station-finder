import { useState, useCallback } from 'react';
import * as Location from 'expo-location';

interface LocationResult {
  id: string;
  name: string;
  address: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

// Popular cities cache to avoid geocoding API calls
const POPULAR_CITIES: LocationResult[] = [
  {
    id: 'managua',
    name: 'Managua',
    address: 'Managua, Nicaragua',
    coordinates: { latitude: 12.1364, longitude: -86.2514 }
  },
  {
    id: 'leon',
    name: 'León',
    address: 'León, Nicaragua',
    coordinates: { latitude: 12.4346, longitude: -86.8784 }
  },
  {
    id: 'granada',
    name: 'Granada',
    address: 'Granada, Nicaragua',
    coordinates: { latitude: 11.9345, longitude: -85.9560 }
  },
  {
    id: 'masaya',
    name: 'Masaya',
    address: 'Masaya, Nicaragua',
    coordinates: { latitude: 11.9742, longitude: -86.0958 }
  },
  {
    id: 'matagalpa',
    name: 'Matagalpa',
    address: 'Matagalpa, Nicaragua',
    coordinates: { latitude: 12.9266, longitude: -85.9175 }
  },
  {
    id: 'esteli',
    name: 'Estelí',
    address: 'Estelí, Nicaragua',
    coordinates: { latitude: 13.0929, longitude: -86.3540 }
  },
  {
    id: 'jinotega',
    name: 'Jinotega',
    address: 'Jinotega, Nicaragua',
    coordinates: { latitude: 13.0907, longitude: -85.9994 }
  },
  {
    id: 'chinandega',
    name: 'Chinandega',
    address: 'Chinandega, Nicaragua',
    coordinates: { latitude: 12.6244, longitude: -87.1306 }
  }
];

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
      const filteredCities = POPULAR_CITIES.filter(city =>
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
      const filteredCities = POPULAR_CITIES.filter(city =>
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
    return POPULAR_CITIES;
  }, []);

  return {
    searchLocation,
    getPopularCities,
    searchResults,
    isSearching,
  };
};
