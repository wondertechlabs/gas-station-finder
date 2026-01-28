import { useMemo, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker } from 'react-native-maps';
import { useQueryClient } from '@tanstack/react-query';
import { GasStation } from '~/types/gasStation';
import { useGasStationActions } from '~/hooks/useGasStationActions';
import { gasStationKeys } from '~/hooks/useGasStations';
import { StatusBar } from 'expo-status-bar';

export default function GasStationDetailsScreen() {
  const { stationId } = useLocalSearchParams<{ stationId: string }>();
  const { handleNavigate } = useGasStationActions();
  const queryClient = useQueryClient();

  const station: GasStation | null = useMemo(() => {
    if (!stationId) return null;

    const queries = queryClient.getQueriesData<GasStation[]>({
      queryKey: gasStationKeys.lists(),
    });

    for (const [, data] of queries) {
      if (data) {
        const found = data.find((s) => s.id === stationId);
        if (found) return found;
      }
    }

    return null;
  }, [stationId, queryClient]);

  const handleNavigatePress = useCallback(() => {
    if (!station) return;
    Alert.alert(
      'Elegir App de Navegación',
      `¿Cómo quieres navegar a ${station.name}?`,
      [
        {
          text: 'Google Maps',
          onPress: () => handleNavigate(station, 'google'),
        },
        {
          text: 'Waze',
          onPress: () => handleNavigate(station, 'waze'),
        },
        {
          text: 'Cancelar',
          style: 'cancel',
        },
      ],
    );
  }, [station, handleNavigate]);

  if (!station) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <Ionicons name="alert-circle-outline" size={64} color="#ef4444" />
        <Text className="text-xl font-semibold text-gray-900 text-center mb-2 mt-4">
          Gasolinera no encontrada
        </Text>
        <Text className="text-gray-600 text-center mb-6">
          No se pudo cargar la información de la gasolinera
        </Text>
        <TouchableOpacity
          className="bg-primary-500 px-6 py-3 rounded-lg"
          onPress={() => router.back()}
        >
          <Text className="text-white font-semibold">Volver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar style="dark" />

      <ScrollView
        className="flex-1 px-4 py-6 pb-20"
        showsVerticalScrollIndicator={false}
      >
        <View className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-6">
          <View className="flex-row items-start justify-between mb-3">
            <View className="flex-1">
              <Text className="text-xl font-bold text-gray-900 mb-1">
                {station.name}
              </Text>
              <Text className="text-base text-primary-600 font-medium mb-2">
                {station.brand}
              </Text>
              <Text className="text-sm text-gray-600 leading-5">
                {station.address}
              </Text>
            </View>
          </View>

          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-row items-center">
              <Ionicons
                name={station.isOpen ? 'checkmark-circle' : 'close-circle'}
                size={20}
                color={station.isOpen ? '#142968' : '#ef4444'}
              />
              <Text className="ml-2 text-base font-medium text-gray-700">
                {station.isOpen ? 'Abierto' : 'Cerrado'}
              </Text>
              {station.is24Hours && (
                <View className="ml-2 bg-green-100 px-2 py-1 rounded-full">
                  <Text className="text-xs font-medium text-green-700">
                    24h
                  </Text>
                </View>
              )}
            </View>
            {station.rating && (
              <View className="flex-row items-center">
                <Ionicons name="star" size={18} color="#fbbf24" />
                <Text className="ml-1 text-base font-medium text-gray-700">
                  {station.rating.toFixed(1)}
                </Text>
              </View>
            )}
          </View>

          <View className="flex-row items-center mb-4">
            <Ionicons name="location-outline" size={16} color="#6b7280" />
            <Text className="ml-2 text-sm text-gray-600">
              A {station.distance?.toFixed(1)} km de distancia
            </Text>
          </View>
        </View>

        {station.fuelTypes && station.fuelTypes.length > 0 && (
          <View className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-6">
            <Text className="text-lg font-semibold text-gray-900 mb-3">
              Precios de Combustible
            </Text>
            <View className="space-y-4">
              {station.fuelTypes.map((fuel, index) => (
                <View
                  key={index}
                  className="flex-row items-center justify-between py-2"
                >
                  <Text className="text-base text-gray-700">
                    {fuel.displayName}
                  </Text>
                  <Text className="text-lg font-bold text-primary-600">
                    C${fuel.price.toFixed(2)}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Amenities */}
        {station.amenities && station.amenities.length > 0 && (
          <View className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-6">
            <Text className="text-lg font-semibold text-gray-900 mb-3">
              Servicios Disponibles
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {station.amenities.map((amenity, index) => (
                <View
                  key={index}
                  className="bg-primary-50 px-4 py-2 rounded-full"
                >
                  <Text className="text-sm font-medium text-primary-700">
                    {amenity}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Map Preview */}
        <View className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-6">
          <Text className="text-lg font-semibold text-gray-900 mb-3">
            Ubicación
          </Text>
          <View className="h-48 rounded-lg overflow-hidden">
            <MapView
              style={{ flex: 1 }}
              region={{
                latitude: station.coordinates.latitude,
                longitude: station.coordinates.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
              scrollEnabled={false}
              zoomEnabled={false}
              pitchEnabled={false}
              rotateEnabled={false}
            >
              <Marker
                coordinate={{
                  latitude: station.coordinates.latitude,
                  longitude: station.coordinates.longitude,
                }}
                title={station.name}
                description={station.address}
              />
            </MapView>
          </View>
        </View>

        {/* Action Button */}
        <View className="mb-8 mt-2">
          <TouchableOpacity
            onPress={handleNavigatePress}
            className="bg-primary-500 py-4 rounded-xl flex-row items-center justify-center"
          >
            <Ionicons name="navigate" size={20} color="white" />
            <Text className="text-white font-semibold text-lg ml-2">
              Ir a la gasolinera
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
