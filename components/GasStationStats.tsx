import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GasStation } from '~/types/gasStation';

interface GasStationStatsProps {
  gasStations: GasStation[];
}

export const GasStationStats: React.FC<GasStationStatsProps> = ({
  gasStations,
}) => {
  const stats = React.useMemo(() => {
    const total = gasStations.length;
    const open = gasStations.filter((s) => s.isOpen).length;
    const open24Hours = gasStations.filter((s) => s.is24Hours).length;
    const withATM = gasStations.filter((s) =>
      s.amenities.includes('ATM'),
    ).length;
    const withWash = gasStations.filter((s) =>
      s.amenities.includes('Lavado'),
    ).length;

    const averageRating =
      gasStations.reduce((sum, s) => sum + (s.rating || 0), 0) / total;

    return {
      total,
      open,
      open24Hours,
      withATM,
      withWash,
      averageRating: averageRating || 0,
    };
  }, [gasStations]);

  const statItems = [
    {
      icon: 'car' as const,
      label: 'Total',
      value: stats.total,
      color: 'text-blue-600',
    },
    {
      icon: 'checkmark-circle' as const,
      label: 'Abiertas',
      value: stats.open,
      color: 'text-green-600',
    },
    {
      icon: 'time' as const,
      label: '24 horas',
      value: stats.open24Hours,
      color: 'text-purple-600',
    },
    {
      icon: 'card' as const,
      label: 'Con ATM',
      value: stats.withATM,
      color: 'text-orange-600',
    },
    {
      icon: 'water' as const,
      label: 'Lavado',
      value: stats.withWash,
      color: 'text-cyan-600',
    },
    {
      icon: 'star' as const,
      label: 'Promedio',
      value: stats.averageRating.toFixed(1),
      color: 'text-yellow-600',
    },
  ];

  return (
    <View className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 mx-4 mb-4">
      <Text className="text-lg font-bold text-gray-900 mb-3">Estadísticas</Text>
      <View className="flex-row flex-wrap justify-between">
        {statItems.map((item, index) => (
          <View key={index} className="items-center mb-3 w-1/3">
            <View className="w-12 h-12 bg-gray-100 rounded-full items-center justify-center mb-2">
              <Ionicons name={item.icon} size={20} color="#6b7280" />
            </View>
            <Text className={`text-lg font-bold ${item.color}`}>
              {item.value}
            </Text>
            <Text className="text-xs text-gray-600 text-center">
              {item.label}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};
