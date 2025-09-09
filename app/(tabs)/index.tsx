import React, { useCallback } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GasStation } from '~/types/gasStation';
import * as Linking from 'expo-linking';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { useGasStationStore } from '~/stores/gasStationStore';
import { useGasStations } from '~/hooks/useGasStations';
import { useLocation } from '~/hooks/useLocation';

const MANAGUA_COORDINATES = {
  latitude: 12.1364,
  longitude: -86.2514,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

export default function GasStationMap() {
  const { selectedStation, setSelectedStation, clearSelection } =
    useGasStationStore();
  const {
    userLocation,
    isLoading: locationLoading,
    error: locationError,
  } = useLocation();
  const { filteredStations, isLoading, error } = useGasStations();

  const handleMarkerPress = useCallback(
    (station: GasStation) => {
      setSelectedStation(station);
    },
    [setSelectedStation],
  );

  const handleMapPress = useCallback(() => {
    clearSelection();
  }, [clearSelection]);

  const handleNavigate = useCallback((station: GasStation) => {
    const { latitude, longitude } = station.coordinates;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
    Linking.openURL(url);
  }, []);

  const handleCall = useCallback((phone: string) => {
    const url = `tel:${phone}`;
    Linking.openURL(url);
  }, []);

  const mapRegion = userLocation
    ? {
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }
    : MANAGUA_COORDINATES;

  if (locationLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#22C55E" />
        <Text className="mt-4 text-gray-600">Obteniendo ubicación...</Text>
      </View>
    );
  }

  if (locationError) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50 px-6">
        <Ionicons name="location-outline" size={64} color="#ef4444" />
        <Text className="text-xl font-semibold text-gray-900 text-center mb-2 mt-4">
          Error de Ubicación
        </Text>
        <Text className="text-gray-600 text-center mb-6">{locationError}</Text>
        <TouchableOpacity
          className="bg-green-500 px-6 py-3 rounded-lg"
          onPress={() => window.location.reload()}
        >
          <Text className="text-white font-semibold">Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50 px-6">
        <Ionicons name="alert-circle-outline" size={64} color="#ef4444" />
        <Text className="text-xl font-semibold text-gray-900 text-center mb-2 mt-4">
          Error al Cargar Gasolineras
        </Text>
        <Text className="text-gray-600 text-center mb-6">{error.message}</Text>
        <TouchableOpacity
          className="bg-green-500 px-6 py-3 rounded-lg"
          onPress={() => window.location.reload()}
        >
          <Text className="text-white font-semibold">Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1">
      <MapView
        provider={PROVIDER_GOOGLE}
        style={{ flex: 1 }}
        region={mapRegion}
        onPress={handleMapPress}
        showsUserLocation
        showsMyLocationButton
      >
        {filteredStations.map((station) => (
          <Marker
            key={station.id}
            coordinate={station.coordinates}
            title={station.name}
            description={station.brand}
            onPress={() => handleMarkerPress(station)}
          />
        ))}
      </MapView>

      {isLoading && (
        <View className="absolute top-16 left-4 right-4">
          <View className="bg-white rounded-lg p-4 shadow-lg flex-row items-center">
            <ActivityIndicator size="small" color="#22C55E" />
            <Text className="ml-3 text-gray-700">Cargando gasolineras...</Text>
          </View>
        </View>
      )}

      {selectedStation && (
        <View className="absolute bottom-4 left-4 right-4">
          <View className="bg-white rounded-xl shadow-lg p-4">
            <View className="flex-row justify-between items-start mb-3">
              <View className="flex-1">
                <Text className="text-lg font-semibold text-gray-900">
                  {selectedStation.name}
                </Text>
                <Text className="text-sm text-gray-600 mb-1">
                  {selectedStation.brand}
                </Text>
                <Text className="text-sm text-gray-500">
                  {selectedStation.address}
                </Text>
              </View>
              <TouchableOpacity onPress={clearSelection} className="p-1">
                <Ionicons name="close" size={18} color="#6b7280" />
              </TouchableOpacity>
            </View>

            <View className="flex-row items-center mb-3">
              <View className="flex-row items-center mr-4">
                <Ionicons
                  name={
                    selectedStation.isOpen ? 'checkmark-circle' : 'close-circle'
                  }
                  size={16}
                  color={selectedStation.isOpen ? '#22C55E' : '#ef4444'}
                />
                <Text className="ml-1 text-sm text-gray-600">
                  {selectedStation.isOpen ? 'Abierto' : 'Cerrado'}
                </Text>
              </View>
              {selectedStation.rating && (
                <View className="flex-row items-center">
                  <Ionicons name="star" size={16} color="#fbbf24" />
                  <Text className="ml-1 text-sm text-gray-600">
                    {selectedStation.rating.toFixed(1)}
                  </Text>
                </View>
              )}
            </View>

            <View className="flex-row space-x-3">
              <TouchableOpacity
                onPress={() => handleNavigate(selectedStation)}
                className="flex-1 bg-green-500 py-3 rounded-lg flex-row items-center justify-center"
              >
                <Ionicons name="navigate" size={16} color="white" />
                <Text className="text-white font-semibold ml-2">Navegar</Text>
              </TouchableOpacity>

              {selectedStation.phone && (
                <TouchableOpacity
                  onPress={() => handleCall(selectedStation.phone!)}
                  className="flex-1 bg-blue-500 py-3 rounded-lg flex-row items-center justify-center"
                >
                  <Ionicons name="call" size={16} color="white" />
                  <Text className="text-white font-semibold ml-2">Llamar</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      )}
    </View>
  );
}
