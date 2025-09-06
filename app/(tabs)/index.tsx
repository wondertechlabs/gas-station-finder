import { AppleMaps } from 'expo-maps';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GasStationService } from '~/services/gasStationService';
import { GasStation } from '~/types/gasStation';
import { useState, useEffect } from 'react';

export default function MapTab() {
  const [gasStations, setGasStations] = useState<GasStation[]>([]);
  const [selectedStation, setSelectedStation] = useState<GasStation | null>(null);

  useEffect(() => {
    const loadGasStations = async () => {
      const stations = await GasStationService.findNearby();
      setGasStations(stations);
    };
    loadGasStations();
  }, []);

  // Managua, Nicaragua coordinates
  const managuaCenter = {
    latitude: 12.1364,
    longitude: -86.2514
  };

  const markers = gasStations.map((station) => ({
    id: station.id,
    coordinates: station.coordinates,
    title: station.name,
    subtitle: station.brand || 'Gasolinera',
    onPress: () => setSelectedStation(station),
  }));

  return (
    <View className="flex-1">
      <AppleMaps.View
        style={{ flex: 1 }}
        cameraPosition={{
          coordinates: managuaCenter,
          zoom: 13
        }}
        markers={markers}
        onMarkerClick={(marker) => {
          const station = gasStations.find(s => s.id === marker.id);
          if (station) {
            setSelectedStation(station);
          }
        }}
        onMapClick={() => setSelectedStation(null)}
      />

      {selectedStation && (
        <View className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl max-h-1/2">
          {/* Handle Bar */}
          <View className="w-12 h-1 bg-gray-300 rounded-full self-center mt-3 mb-2" />
          
          <View className="px-6 pb-6">
            {/* Header */}
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

            {/* Address */}
            <View className="flex-row items-start mb-4">
              <View className="mt-0.5 mr-2">
                <Ionicons name="location-outline" size={16} color="#6b7280" />
              </View>
              <Text className="text-sm text-gray-600 flex-1 leading-5">
                {selectedStation.address}
              </Text>
            </View>

            {/* Fuel Prices */}
            <View className="bg-gray-50 rounded-2xl p-4 mb-4">
              <Text className="text-sm font-semibold text-gray-900 mb-3">Precios de Combustible</Text>
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
              <Text className="text-sm font-semibold text-gray-900 mb-2">Servicios</Text>
              <View className="flex-row flex-wrap">
                {selectedStation.amenities.map((amenity, index) => (
                  <View key={index} className="flex-row items-center mr-4 mb-2 bg-green-50 px-3 py-1.5 rounded-full">
                    <Ionicons name="checkmark-circle" size={14} color="#10b981" />
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
                <TouchableOpacity className="bg-blue-500 px-4 py-2 rounded-full">
                  <Text className="text-white text-sm font-medium">Direcciones</Text>
                </TouchableOpacity>
                <TouchableOpacity className="bg-gray-100 px-4 py-2 rounded-full">
                  <Text className="text-gray-700 text-sm font-medium">Llamar</Text>
                </TouchableOpacity>
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
    </View>
  );
}