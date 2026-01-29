import { useMemo, useCallback } from 'react';
import { View, Text, Pressable, ScrollView, Alert } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker } from 'react-native-maps';
import { useQueryClient } from '@tanstack/react-query';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { GasStation } from '~/domain/gasStation/models';
import { useGasStationActions } from '~/presentation/hooks/useGasStationActions';
import { gasStationKeys } from '~/presentation/hooks/useGasStations';
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

  const onNavigate = useCallback(() => {
    if (!station) return;
    Alert.alert('Navegar', `¿Cómo quieres ir a ${station.name}?`, [
      { text: 'Google Maps', onPress: () => handleNavigate(station, 'google') },
      { text: 'Waze', onPress: () => handleNavigate(station, 'waze') },
      { text: 'Cancelar', style: 'cancel' },
    ]);
  }, [station, handleNavigate]);

  const formatDistance = (distance?: number) => {
    if (!distance) return null;
    return distance < 1000
      ? `${Math.round(distance)}m`
      : `${(distance / 1000).toFixed(1)}km`;
  };

  if (!station) {
    return (
      <SafeAreaView className="flex-1 bg-gray-100">
        <View className="flex-1 justify-center items-center px-6">
          <Ionicons name="alert-circle-outline" size={48} color="#9ca3af" />
          <Text className="text-lg font-semibold text-gray-900 mt-4 mb-2">
            Gasolinera no encontrada
          </Text>
          <Text className="text-gray-500 text-center mb-6">
            No se pudo cargar la información
          </Text>
          <Pressable
            className="bg-primary-500 px-6 py-3 rounded-lg"
            onPress={() => router.back()}
          >
            <Text className="text-white font-semibold">Volver</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <StatusBar style="dark" />

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="h-48 bg-gray-200">
          <MapView
            style={{ flex: 1 }}
            region={{
              latitude: station.coordinates.latitude,
              longitude: station.coordinates.longitude,
              latitudeDelta: 0.008,
              longitudeDelta: 0.008,
            }}
            scrollEnabled={false}
            zoomEnabled={false}
          >
            <Marker
              coordinate={{
                latitude: station.coordinates.latitude,
                longitude: station.coordinates.longitude,
              }}
            />
          </MapView>
        </View>

        <View className="px-4 py-4">
          <View className="bg-white rounded-xl p-4 mb-3">
            <View className="flex-row items-center justify-between mb-3">
              <View className="flex-row items-center">
                <View className={`w-2 h-2 rounded-full mr-2 ${station.isOpen ? 'bg-green-500' : 'bg-gray-300'}`} />
                <Text className={`text-sm font-medium ${station.isOpen ? 'text-green-600' : 'text-gray-400'}`}>
                  {station.isOpen ? 'Abierto' : 'Cerrado'}
                </Text>
                {station.is24Hours && (
                  <Text className="text-xs text-gray-400 ml-2">• 24 horas</Text>
                )}
              </View>
              {station.rating && (
                <View className="flex-row items-center">
                  <Ionicons name="star" size={14} color="#fbbf24" />
                  <Text className="text-sm font-medium text-gray-700 ml-1">
                    {station.rating.toFixed(1)}
                  </Text>
                </View>
              )}
            </View>

            <View className="flex-row items-start">
              <Ionicons name="location-outline" size={16} color="#9ca3af" style={{ marginTop: 2 }} />
              <Text className="text-sm text-gray-600 flex-1 ml-2 leading-5">
                {station.address}
              </Text>
            </View>

            {station.distance && (
              <View className="flex-row items-center mt-2">
                <Ionicons name="navigate-outline" size={14} color="#9ca3af" />
                <Text className="text-sm text-gray-500 ml-2">
                  A {formatDistance(station.distance)} de distancia
                </Text>
              </View>
            )}
          </View>
          
          {station.fuelTypes.length > 0 && (
            <View className="bg-white rounded-xl p-4 mb-3">
              <Text className="text-sm font-semibold text-gray-900 mb-3">
                Precios de combustible
              </Text>
              {station.fuelTypes.map((fuel, index) => (
                <View
                  key={index}
                  className={`flex-row items-center justify-between py-3 ${
                    index < station.fuelTypes.length - 1 ? 'border-b border-gray-100' : ''
                  }`}
                >
                  <Text className="text-sm text-gray-600">{fuel.displayName}</Text>
                  <Text className="text-base font-bold text-gray-900">
                    C${fuel.price.toFixed(2)}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {station.amenities && station.amenities.length > 0 && (
            <View className="bg-white rounded-xl p-4 mb-3">
              <Text className="text-sm font-semibold text-gray-900 mb-3">
                Servicios
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {station.amenities.map((amenity, index) => (
                  <View key={index} className="bg-gray-100 px-3 py-1.5 rounded-full">
                    <Text className="text-xs text-gray-600">{amenity}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      <View className="px-4 py-4 bg-white border-t border-gray-200">
        <Pressable
          className="bg-primary-500 py-4 rounded-xl flex-row items-center justify-center"
          onPress={onNavigate}
        >
          <Ionicons name="navigate" size={18} color="white" />
          <Text className="text-white font-bold ml-2">Ir a la gasolinera</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
