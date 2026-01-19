import { useMemo } from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocationStore } from '~/stores/locationStore';
import { COLORS } from '~/config/constants';

export default function SearchTab() {
  const { selectedLocation, address } = useLocationStore();

  const currentLocationName = useMemo(
    () => selectedLocation?.name || address || 'Ubicación actual',
    [selectedLocation?.name, address],
  );

  return (
    <View className="flex-1 bg-gray-50 items-center justify-center px-4">
      <View className="items-center">
        <View
          className="w-16 h-16 rounded-full items-center justify-center mb-4"
          style={{
            backgroundColor: selectedLocation ? COLORS.PRIMARY + '20' : '#f3f4f6',
          }}
        >
          <Ionicons
            name={selectedLocation ? 'location' : 'location-outline'}
            size={32}
            color={selectedLocation ? COLORS.PRIMARY : '#9ca3af'}
          />
        </View>
        <Text className="text-lg font-semibold text-gray-900 mb-2">
          {selectedLocation ? 'Ubicación seleccionada' : 'Ubicación actual'}
        </Text>
        <Text className="text-base text-gray-600 text-center" numberOfLines={2}>
          {currentLocationName}
        </Text>
      </View>
    </View>
  );
}
