import { AppleMaps } from 'expo-maps';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GasStationService } from '~/services/gasStationService';
import { GasStation } from '~/types/gasStation';
import { useState, useEffect, useCallback } from 'react';
import * as Linking from 'expo-linking';
import { SearchBar } from '~/components/SearchBar';
import { FilterModal } from '~/components/FilterModal';
import { useGasStationFilters } from '~/hooks/useGasStationFilters';

export default function MapTab() {
  const [gasStations, setGasStations] = useState<GasStation[]>([]);
  const [selectedStation, setSelectedStation] = useState<GasStation | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const {
    filteredStations,
    filters,
    handleSearch,
    handleApplyFilters,
    hasActiveFilters,
  } = useGasStationFilters(gasStations);

  useEffect(() => {
    const loadGasStations = async () => {
      try {
        setIsLoading(true);
        const stations = await GasStationService.findNearby();
        setGasStations(stations);
      } catch (error) {
        console.error('Error loading gas stations:', error);
        Alert.alert('Error', 'No se pudieron cargar las gasolineras');
      } finally {
        setIsLoading(false);
      }
    };
    loadGasStations();
  }, []);

  // Coordenadas más precisas de Managua, Nicaragua
  const managuaCenter = {
    latitude: 12.1364,
    longitude: -86.2514,
  };

  const handleMarkerPress = useCallback((station: GasStation) => {
    setSelectedStation(station);
  }, []);

  const handleMapPress = useCallback(() => {
    setSelectedStation(null);
  }, []);

  const handleDirections = useCallback((station: GasStation) => {
    const { latitude, longitude } = station.coordinates;
    const url = `https://maps.apple.com/?daddr=${latitude},${longitude}`;
    Linking.openURL(url);
  }, []);

  const handleCall = useCallback((phone: string) => {
    const url = `tel:${phone}`;
    Linking.openURL(url);
  }, []);

  const handleFilterPress = useCallback(() => {
    setShowFilters(true);
  }, []);

  const markers = filteredStations.map((station) => ({
    id: station.id,
    coordinates: station.coordinates,
    title: station.name,
    subtitle: station.brand || 'Gasolinera',
    onPress: () => handleMarkerPress(station),
  }));

  if (isLoading) {
    return (
      <View className="flex-1 bg-gray-50 items-center justify-center">
        <View className="items-center">
          <View className="w-16 h-16 bg-green-100 rounded-full items-center justify-center mb-4">
            <Ionicons name="car" size={32} color="#10b981" />
          </View>
          <Text className="text-lg font-semibold text-gray-900 mb-2">
            Cargando Gasolineras
          </Text>
          <Text className="text-sm text-gray-600 text-center">
            Buscando las mejores opciones en Managua...
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1">
      <AppleMaps.View
        style={{ flex: 1 }}
        cameraPosition={{
          coordinates: managuaCenter,
          zoom: 13,
        }}
        markers={markers}
        onMarkerClick={(marker) => {
          const station = gasStations.find((s) => s.id === marker.id);
          if (station) {
            handleMarkerPress(station);
          }
        }}
        onMapClick={handleMapPress}
      />

      <View className="absolute top-12 left-0 right-0">
        <SearchBar
          onSearch={handleSearch}
          onFilterPress={handleFilterPress}
          placeholder="Buscar gasolineras en Managua..."
        />
        {hasActiveFilters && (
          <View className="mx-4 mb-2">
            <View className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-2">
              <Text className="text-sm text-blue-700 text-center">
                Filtros activos - {filteredStations.length} gasolineras
                encontradas
              </Text>
            </View>
          </View>
        )}
      </View>

      {/* Header con información de gasolineras */}
      <View className="absolute top-32 left-0 right-0">
        <View className="bg-white rounded-2xl shadow-lg p-4 mx-4">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-lg font-bold text-gray-900">
                Gasolineras en Managua
              </Text>
              <Text className="text-sm text-gray-600">
                {filteredStations.length} de {gasStations.length} estaciones
              </Text>
            </View>
            <View className="flex-row items-center bg-green-50 px-3 py-2 rounded-full">
              <Ionicons name="location" size={16} color="#10b981" />
              <Text className="text-sm font-medium text-green-700 ml-1">
                Managua, Nicaragua
              </Text>
            </View>
          </View>
        </View>
      </View>

      {selectedStation && (
        <View className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl max-h-1/2">
          <View className="w-12 h-1 bg-gray-300 rounded-full self-center mt-3 mb-2" />
          <View className="px-6 pb-6">
            <View className="flex-row justify-between items-start mb-4">
              <View className="flex-1 mr-4">
                <Text className="text-xl font-semibold text-gray-900 mb-1">
                  {selectedStation.name}
                </Text>
                <Text className="text-base text-gray-600 font-medium">
                  {selectedStation.brand}
                </Text>
              </View>
              <View className="flex-row items-center bg-gray-100 px-3 py-2 rounded-full">
                <View
                  className={`w-2 h-2 rounded-full mr-2 ${
                    selectedStation.isOpen ? 'bg-green-500' : 'bg-red-500'
                  }`}
                />
                <Text className="text-sm font-medium text-gray-700">
                  {selectedStation.isOpen ? 'Abierto' : 'Cerrado'}
                </Text>
              </View>
            </View>

            <View className="flex-row items-start mb-4">
              <View className="mt-0.5 mr-2">
                <Ionicons name="location-outline" size={16} color="#6b7280" />
              </View>
              <Text className="text-sm text-gray-600 flex-1 leading-5">
                {selectedStation.address}
              </Text>
            </View>

            <View className="bg-gray-50 rounded-2xl p-4 mb-4">
              <Text className="text-sm font-semibold text-gray-900 mb-3">
                Precios de Combustible
              </Text>
              <View className="flex-row justify-between">
                {selectedStation.fuelTypes.map((fuel, index) => (
                  <View key={index} className="items-center flex-1">
                    <Text className="text-xs text-gray-500 mb-1 text-center">
                      {fuel.displayName}
                    </Text>
                    <Text className="text-lg font-bold text-gray-900">
                      C${fuel.price.toFixed(2)}
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Amenities */}
            <View className="mb-4">
              <Text className="text-sm font-semibold text-gray-900 mb-2">
                Servicios
              </Text>
              <View className="flex-row flex-wrap">
                {selectedStation.amenities.map((amenity, index) => (
                  <View
                    key={index}
                    className="flex-row items-center mr-4 mb-2 bg-green-50 px-3 py-1.5 rounded-full"
                  >
                    <Ionicons
                      name="checkmark-circle"
                      size={14}
                      color="#10b981"
                    />
                    <Text className="text-xs text-green-700 ml-1 font-medium">
                      {amenity}
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Footer */}
            <View className="flex-row justify-between items-center pt-4 border-t border-gray-100">
              <View className="flex-row items-center">
                {selectedStation.rating && (
                  <View className="flex-row items-center mr-4">
                    <Ionicons name="star" size={16} color="#fbbf24" />
                    <Text className="text-sm font-semibold text-gray-900 ml-1">
                      {selectedStation.rating.toFixed(1)}
                    </Text>
                  </View>
                )}
                {selectedStation.phone && (
                  <View className="flex-row items-center">
                    <Ionicons name="call-outline" size={16} color="#6b7280" />
                    <Text className="text-sm text-gray-600 ml-1">
                      {selectedStation.phone}
                    </Text>
                  </View>
                )}
              </View>

              {/* Action Buttons */}
              <View className="flex-row space-x-2">
                <TouchableOpacity
                  className="bg-blue-500 px-4 py-2 rounded-full"
                  onPress={() => handleDirections(selectedStation)}
                >
                  <Text className="text-white text-sm font-medium">
                    Direcciones
                  </Text>
                </TouchableOpacity>
                {selectedStation.phone && (
                  <TouchableOpacity
                    className="bg-gray-100 px-4 py-2 rounded-full"
                    onPress={() => handleCall(selectedStation.phone!)}
                  >
                    <Text className="text-gray-700 text-sm font-medium">
                      Llamar
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>

          {/* Close Button */}
          <TouchableOpacity
            onPress={() => setSelectedStation(null)}
            className="absolute top-4 right-4 w-8 h-8 bg-gray-100 rounded-full items-center justify-center"
          >
            <Ionicons name="close" size={18} color="#6b7280" />
          </TouchableOpacity>
        </View>
      )}

      {/* Filter Modal */}
      <FilterModal
        visible={showFilters}
        onClose={() => setShowFilters(false)}
        onApplyFilters={handleApplyFilters}
        currentFilters={filters}
      />
    </View>
  );
}
