import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  TextInput,
  TouchableOpacity, 
  ScrollView, 
  ActivityIndicator,
  Modal 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useLocationStore } from '~/stores/locationStore';

interface LocationResult {
  id: string;
  name: string;
  address: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

export const LocationSelectorBar = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<LocationResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const { 
    selectedLocation, 
    userLocation, 
    address, 
    setSelectedLocation, 
    clearSelectedLocation 
  } = useLocationStore();

  // Ciudades populares de Nicaragua
  const popularCities: LocationResult[] = [
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

  // Debounced search function
  const debouncedSearch = useCallback(
    (() => {
      let timeoutId: NodeJS.Timeout;
      return (query: string) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          searchLocation(query);
        }, 300); // 300ms debounce
      };
    })(),
    []
  );

  const searchLocation = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      // First, search in popular cities (no API cost)
      const filteredCities = popularCities.filter(city =>
        city.name.toLowerCase().includes(query.toLowerCase()) ||
        city.address.toLowerCase().includes(query.toLowerCase())
      );

      if (filteredCities.length > 0) {
        // Use popular cities results (no API cost)
        setSearchResults(filteredCities);
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
        } else {
          setSearchResults([]);
        }
      }
    } catch (error) {
      console.log('Error searching location:', error);
      // Fallback to popular cities if geocoding fails
      const filteredCities = popularCities.filter(city =>
        city.name.toLowerCase().includes(query.toLowerCase()) ||
        city.address.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(filteredCities);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectLocation = (location: LocationResult) => {
    setSelectedLocation({
      latitude: location.coordinates.latitude,
      longitude: location.coordinates.longitude,
      name: location.name,
      address: location.address,
    });
    setShowDropdown(false);
    setSearchQuery('');
    setSearchResults([]);
  };

  const handleUseCurrentLocation = () => {
    if (userLocation) {
      const location: LocationResult = {
        id: 'current',
        name: 'Mi ubicación actual',
        address: address || 'Ubicación actual',
        coordinates: userLocation
      };
      handleSelectLocation(location);
    }
  };

  const currentLocationName = selectedLocation?.name || address || 'Ubicación actual';

  return (
    <>
      <View className="absolute top-20 left-4 right-4 z-10">
        <TouchableOpacity
          onPress={() => setShowDropdown(true)}
          className="flex-row items-center justify-between bg-white/90 backdrop-blur-sm rounded-xl px-3 py-2 border border-white/20 shadow-lg"
        >
          <View className="flex-row items-center flex-1">
            <Ionicons 
              name={selectedLocation ? "location" : "location-outline"} 
              size={16} 
              color="#2563eb" 
            />
            <View className="ml-2 flex-1">
              <Text className="text-sm font-medium text-gray-900" numberOfLines={1}>
                {currentLocationName}
              </Text>
            </View>
          </View>
          <View className="flex-row items-center">
            {selectedLocation && (
              <TouchableOpacity
                onPress={(e) => {
                  e.stopPropagation();
                  clearSelectedLocation();
                }}
                className="mr-2 p-1 bg-red-50/80 rounded-full"
              >
                <Ionicons name="close" size={12} color="#dc2626" />
              </TouchableOpacity>
            )}
            <Ionicons name="chevron-down" size={14} color="#6b7280" />
          </View>
        </TouchableOpacity>
      </View>

      {/* Dropdown Modal */}
      <Modal
        visible={showDropdown}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowDropdown(false)}
      >
        <View className="flex-1 bg-white">
          {/* Header */}
          <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-200">
            <Text className="text-lg font-bold text-gray-900">Ubicación</Text>
            <TouchableOpacity onPress={() => setShowDropdown(false)} className="p-1">
              <Ionicons name="close" size={20} color="#6b7280" />
            </TouchableOpacity>
          </View>

          {/* Search Input */}
          <View className="px-4 py-3">
            <View className="flex-row items-center bg-gray-100 rounded-xl px-3 py-2">
              <Ionicons name="search" size={16} color="#9ca3af" />
              <TextInput
                className="flex-1 ml-2 text-gray-900 text-sm"
                placeholder="Buscar ciudad..."
                value={searchQuery}
                onChangeText={(text: string) => {
                  setSearchQuery(text);
                  debouncedSearch(text);
                }}
                autoFocus
              />
              {isSearching && (
                <ActivityIndicator size="small" color="#3b82f6" />
              )}
            </View>
          </View>

          <ScrollView className="flex-1 px-4">
            {/* Current Location */}
            {userLocation && (
              <View className="mb-4">
                <Text className="text-sm font-semibold text-gray-700 mb-2">Ubicación Actual</Text>
                <TouchableOpacity
                  onPress={handleUseCurrentLocation}
                  className="flex-row items-center p-3 bg-blue-50 rounded-xl border border-blue-200"
                >
                  <View className="w-8 h-8 bg-blue-500 rounded-lg items-center justify-center mr-3">
                    <Ionicons name="location" size={16} color="white" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-base font-semibold text-gray-900">
                      Mi ubicación actual
                    </Text>
                    <Text className="text-xs text-gray-600">
                      {address || 'Usar GPS actual'}
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color="#9ca3af" />
                </TouchableOpacity>
              </View>
            )}

            {/* Search Results or Popular Cities */}
            {searchQuery ? (
              <View className="mb-4">
                <Text className="text-sm font-semibold text-gray-700 mb-2">
                  Resultados de búsqueda
                </Text>
                {searchResults.length > 0 ? (
                  searchResults.map((location) => (
                    <TouchableOpacity
                      key={location.id}
                      onPress={() => handleSelectLocation(location)}
                      className="flex-row items-center p-3 bg-gray-50 rounded-xl mb-2 border border-gray-200"
                    >
                      <View className="w-8 h-8 bg-gray-400 rounded-lg items-center justify-center mr-3">
                        <Ionicons name="location-outline" size={16} color="white" />
                      </View>
                      <View className="flex-1">
                        <Text className="text-base font-semibold text-gray-900">
                          {location.name}
                        </Text>
                        <Text className="text-xs text-gray-600">
                          {location.address}
                        </Text>
                      </View>
                      <Ionicons name="chevron-forward" size={16} color="#9ca3af" />
                    </TouchableOpacity>
                  ))
                ) : !isSearching ? (
                  <Text className="text-gray-500 text-center py-3 text-sm">
                    No se encontraron resultados
                  </Text>
                ) : null}
              </View>
            ) : (
              <View className="mb-4">
                <Text className="text-sm font-semibold text-gray-700 mb-2">
                  Ciudades populares
                </Text>
                {popularCities.map((city) => (
                  <TouchableOpacity
                    key={city.id}
                    onPress={() => handleSelectLocation(city)}
                    className="flex-row items-center p-3 bg-gray-50 rounded-xl mb-2 border border-gray-200"
                  >
                    <View className="w-8 h-8 bg-green-500 rounded-lg items-center justify-center mr-3">
                      <Ionicons name="location" size={16} color="white" />
                    </View>
                    <View className="flex-1">
                      <Text className="text-base font-semibold text-gray-900">
                        {city.name}
                      </Text>
                      <Text className="text-xs text-gray-600">
                        {city.address}
                      </Text>
                    </View>
                    <Ionicons name="chevron-forward" size={16} color="#9ca3af" />
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </ScrollView>
        </View>
      </Modal>
    </>
  );
};
