import React, { useCallback, useMemo } from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import type { GasStation } from '~/domain/gasStation/models';
import { useGasStationActions } from '~/presentation/hooks/useGasStationActions';

interface GasStationCardProps {
  station: GasStation;
}

export const GasStationCard = React.memo<GasStationCardProps>(({ station }) => {
  const { handleNavigate } = useGasStationActions();

  const handleCardPress = useCallback(() => {
    router.push({
      pathname: '/gas-station-details',
      params: {
        stationId: station.id,
      },
    });
  }, [station.id]);

  const handleNavigatePress = useCallback(() => {
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

  const formatDistance = useCallback((distance?: number): string => {
    if (!distance) return '';
    if (distance < 1000) {
      return `${Math.round(distance)}m`;
    }
    return `${(distance / 1000).toFixed(1)}km`;
  }, []);

  const brandColor = useMemo(() => {
    const brandColors: Record<string, string> = {
      shell: '#fbbf24',
      petronic: '#dc2626',
      texaco: '#dc2626',
      'uno gas': '#2563eb',
      puma: '#ea580c',
      esso: '#dc2626',
    };
    return brandColors[station.brand?.toLowerCase() || ''] || '#64748b';
  }, [station.brand]);

  return (
    <TouchableOpacity
      className="bg-white rounded-2xl p-5 mb-3 mx-4 border border-slate-200"
      onPress={handleCardPress}
      activeOpacity={0.7}
    >
      <View className="mb-4">
        <View className="flex-row items-center mb-3">
          <View
            className="w-1 h-7 rounded-sm mr-4"
            style={{ backgroundColor: brandColor }}
          />
          <Text className="text-xl font-bold text-slate-900 flex-1">
            {station.name}
          </Text>
          {station.distance && (
            <Text className="text-sm text-slate-500 font-semibold">
              {formatDistance(station.distance)}
            </Text>
          )}
        </View>

        <View className="flex-row gap-2">
          <View
            className="flex-row items-center px-3 py-1.5 rounded-2xl gap-1.5"
            style={{ backgroundColor: station.isOpen ? '#22c55e' : '#ef4444' }}
          >
            <Ionicons name="time" size={12} color="white" />
            <Text className="text-xs font-semibold text-white">
              {station.isOpen ? 'Abierto' : 'Cerrado'}
            </Text>
          </View>

          {station.is24Hours && (
            <View className="px-3 py-1.5 rounded-2xl bg-emerald-500">
              <Text className="text-xs font-semibold text-white">24h</Text>
            </View>
          )}
        </View>
      </View>

      <View className="flex-row items-center mb-3 gap-2">
        <Ionicons name="location" size={14} color="#64748b" />
        <Text className="text-slate-600 flex-1 leading-5">
          {station.address}
        </Text>
      </View>

      {station.rating && (
        <View className="flex-row items-center mb-4 gap-1.5">
          <Ionicons name="star" size={14} color="#f59e0b" />
          <Text className="text-slate-900 font-semibold">
            {station.rating.toFixed(1)}
          </Text>
        </View>
      )}

      <View className="flex-row flex-wrap gap-2.5 mb-5">
        {station.fuelTypes.slice(0, 3).map((fuel, index) => (
          <View
            key={index}
            className="flex-row items-center bg-slate-50 px-3 py-2 rounded-2xl gap-2 border border-slate-200"
          >
            <View
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: getFuelColor(fuel.type) }}
            />
            <Text className="text-sm text-slate-900 font-semibold">
              {fuel.displayName}: C${fuel.price}
            </Text>
          </View>
        ))}
      </View>

      <TouchableOpacity
        className="flex-row items-center justify-center bg-primary-500 py-4 rounded-2xl gap-2"
        onPress={handleNavigatePress}
      >
        <Ionicons name="navigate" size={18} color="white" />
        <Text className="text-base font-bold text-white">
          Ir a la gasolinera
        </Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
});

const getFuelColor = (type: string): string => {
  const colors: { [key: string]: string } = {
    regular: '#22c55e',
    super: '#f59e0b',
    diesel: '#2563eb',
    glp: '#10b981',
  };
  return colors[type] || '#94a3b8';
};
