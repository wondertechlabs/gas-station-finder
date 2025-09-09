import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Modal, 
  TextInput, 
  ScrollView, 
  ActivityIndicator,
  Alert 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
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

interface LocationSelectorProps {
  visible: boolean;
  onClose: () => void;
  onSelectLocation: (location: LocationResult) => void;
  currentLocation: {
    latitude: number;
    longitude: number;
  } | null;
}

export const LocationSelector = ({ 
  visible, 
  onClose, 
  onSelectLocation, 
  currentLocation 
}: LocationSelectorProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<LocationResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [recentLocations, setRecentLocations] = useState<LocationResult[]>([]);

  // Ciudades populares de Nicaragua como sugerencias
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

  const searchLocation = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      // Buscar en ciudades populares primero
      const filteredCities = popularCities.filter(city =>
        city.name.toLowerCase().includes(query.toLowerCase()) ||
        city.address.toLowerCase().includes(query.toLowerCase())
      );

      // Si no hay resultados en ciudades populares, usar geocoding
      if (filteredCities.length === 0) {
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
        setSearchResults(filteredCities);
      }
    } catch (error) {
      console.log('Error searching location:', error);
      Alert.alert('Error', 'No se pudo buscar la ubicación');
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    if (searchQuery) {
      const timeoutId = setTimeout(() => {
        searchLocation(searchQuery);
      }, 500);
      return () => clearTimeout(timeoutId);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const handleSelectLocation = (location: LocationResult) => {
    onSelectLocation(location);
    onClose();
  };

  const handleUseCurrentLocation = () => {
    if (currentLocation) {
      const location: LocationResult = {
        id: 'current',
        name: 'Mi ubicación actual',
        address: 'Ubicación actual',
        coordinates: currentLocation
      };
      onSelectLocation(location);
      onClose();
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-white">
        {/* Header */}
        <View className="flex-row items-center justify-between px-6 py-4 border-b border-gray-200">
          <Text className="text-xl font-bold text-gray-900">Seleccionar Ubicación</Text>
          <TouchableOpacity onPress={onClose} className="p-2">
            <Ionicons name="close" size={24} color="#6b7280" />
          </TouchableOpacity>
        </View>

        {/* Search Input */}
        <View className="px-6 py-4">
          <View className="flex-row items-center bg-gray-100 rounded-2xl px-4 py-3">
            <Ionicons name="search" size={20} color="#9ca3af" />
            <TextInput
              className="flex-1 ml-3 text-gray-900"
              placeholder="Buscar ciudad o ubicación..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoFocus
            />
            {isSearching && (
              <ActivityIndicator size="small" color="#3b82f6" />
            )}
          </View>
        </View>

        <ScrollView className="flex-1 px-6">
          {/* Current Location */}
          {currentLocation && (
            <View className="mb-6">
              <Text className="text-sm font-semibold text-gray-700 mb-3">Ubicación Actual</Text>
              <TouchableOpacity
                onPress={handleUseCurrentLocation}
                className="flex-row items-center p-4 bg-blue-50 rounded-2xl border border-blue-200"
              >
                <View className="w-10 h-10 bg-blue-500 rounded-xl items-center justify-center mr-4">
                  <Ionicons name="location" size={20} color="white" />
                </View>
                <View className="flex-1">
                  <Text className="text-lg font-semibold text-gray-900">
                    Mi ubicación actual
                  </Text>
                  <Text className="text-sm text-gray-600">
                    Usar GPS actual
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
              </TouchableOpacity>
            </View>
          )}

          {/* Search Results */}
          {searchQuery ? (
            <View className="mb-6">
              <Text className="text-sm font-semibold text-gray-700 mb-3">
                Resultados de búsqueda
              </Text>
              {searchResults.length > 0 ? (
                searchResults.map((location) => (
                  <TouchableOpacity
                    key={location.id}
                    onPress={() => handleSelectLocation(location)}
                    className="flex-row items-center p-4 bg-gray-50 rounded-2xl mb-3 border border-gray-200"
                  >
                    <View className="w-10 h-10 bg-gray-400 rounded-xl items-center justify-center mr-4">
                      <Ionicons name="location-outline" size={20} color="white" />
                    </View>
                    <View className="flex-1">
                      <Text className="text-lg font-semibold text-gray-900">
                        {location.name}
                      </Text>
                      <Text className="text-sm text-gray-600">
                        {location.address}
                      </Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
                  </TouchableOpacity>
                ))
              ) : !isSearching ? (
                <Text className="text-gray-500 text-center py-4">
                  No se encontraron resultados
                </Text>
              ) : null}
            </View>
          ) : (
            <View className="mb-6">
              <Text className="text-sm font-semibold text-gray-700 mb-3">
                Ciudades populares
              </Text>
              {popularCities.map((city) => (
                <TouchableOpacity
                  key={city.id}
                  onPress={() => handleSelectLocation(city)}
                  className="flex-row items-center p-4 bg-gray-50 rounded-2xl mb-3 border border-gray-200"
                >
                  <View className="w-10 h-10 bg-green-500 rounded-xl items-center justify-center mr-4">
                    <Ionicons name="location" size={20} color="white" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-lg font-semibold text-gray-900">
                      {city.name}
                    </Text>
                    <Text className="text-sm text-gray-600">
                      {city.address}
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
                </TouchableOpacity>
              ))}
            </View>
          )}
        </ScrollView>
      </View>
    </Modal>
  );
};
