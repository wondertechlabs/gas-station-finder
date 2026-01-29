import React, { useCallback } from 'react';
import { Alert, Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import type { GasStation } from '~/domain/gasStation/models';
import { useGasStationActions } from '~/presentation/hooks/useGasStationActions';

interface Props {
  station: GasStation;
}

export const GasStationCard = React.memo<Props>(({ station }) => {
  const { handleNavigate } = useGasStationActions();

  const onPress = useCallback(() => {
    router.push({ pathname: '/gas-station-details', params: { stationId: station.id } });
  }, [station.id]);

  const onNavigate = useCallback(() => {
    Alert.alert('Navegar', `¿Cómo quieres ir a ${station.name}?`, [
      { text: 'Google Maps', onPress: () => handleNavigate(station, 'google') },
      { text: 'Waze', onPress: () => handleNavigate(station, 'waze') },
      { text: 'Cancelar', style: 'cancel' },
    ]);
  }, [station, handleNavigate]);

  const distance = station.distance
    ? station.distance < 1000
      ? `${Math.round(station.distance)}m`
      : `${(station.distance / 1000).toFixed(1)}km`
    : null;

  return (
    <Pressable className="bg-white p-4 mb-3 rounded-xl" onPress={onPress}>
      <View className="flex-row items-center justify-between mb-2">
        <Text className="text-lg font-bold text-gray-900 flex-1 mr-2" numberOfLines={1}>
          {station.name}
        </Text>
        {distance && (
          <Text className="text-sm font-medium text-gray-400">{distance}</Text>
        )}
      </View>

      <View className="flex-row items-center mb-3">
        <View className={`w-2 h-2 rounded-full mr-2 ${station.isOpen ? 'bg-green-500' : 'bg-gray-300'}`} />
        <Text className={`text-sm ${station.isOpen ? 'text-green-600' : 'text-gray-400'}`}>
          {station.isOpen ? 'Abierto' : 'Cerrado'}
        </Text>
        {station.rating && (
          <>
            <Text className="text-gray-300 mx-2">•</Text>
            <Ionicons name="star" size={12} color="#fbbf24" />
            <Text className="text-sm text-gray-600 ml-1">{station.rating.toFixed(1)}</Text>
          </>
        )}
      </View>

      <Text className="text-sm text-gray-500 mb-4" numberOfLines={2}>
        {station.address}
      </Text>

      {station.fuelTypes.length > 0 && (
        <View className="flex-row mb-4 gap-3">
          {station.fuelTypes.slice(0, 3).map((fuel, i) => (
            <View key={i} className="flex-1 bg-gray-50 rounded-lg py-2 px-3">
              <Text className="text-xs text-gray-500 text-center">{fuel.displayName}</Text>
              <Text className="text-sm font-bold text-gray-900 text-center">C${fuel.price}</Text>
            </View>
          ))}
        </View>
      )}

      <Pressable
        className="bg-primary-500 rounded-lg py-3 flex-row items-center justify-center"
        onPress={onNavigate}
      >
        <Ionicons name="navigate" size={16} color="white" />
        <Text className="text-white font-semibold ml-2">Ir a la gasolinera</Text>
      </Pressable>
    </Pressable>
  );
});
