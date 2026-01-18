import { useState, useMemo, useCallback } from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocationStore } from '~/stores/locationStore';
import { LocationResult } from '~/types/location';
import { COLORS } from '~/config/constants';
import { LocationSearchModal } from './LocationSearchModal';

export const LocationSelectorBar = () => {
  const [showModal, setShowModal] = useState(false);

  const { selectedLocation, address, clearSelectedLocation } = useLocationStore();

  const currentLocationName = useMemo(
    () => selectedLocation?.name || address || 'Ubicación actual',
    [selectedLocation?.name, address],
  );

  const handleSelectLocation = useCallback((location: LocationResult) => {
    setShowModal(false);
  }, []);

  const handleClearLocation = useCallback(
    (e: { stopPropagation: () => void }) => {
      e.stopPropagation();
      clearSelectedLocation();
    },
    [clearSelectedLocation],
  );

  return (
    <>
      <View className="absolute top-20 left-4 right-4 z-10">
        <Pressable
          onPress={() => setShowModal(true)}
          className="flex-row items-center justify-between bg-white rounded-2xl px-4 py-3.5 shadow-lg"
          style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 4,
          }}
        >
          <View className="flex-row items-center flex-1">
            <View
              className="w-10 h-10 rounded-xl items-center justify-center mr-3"
              style={{
                backgroundColor: selectedLocation ? COLORS.PRIMARY + '15' : '#f3f4f6',
              }}
            >
              <Ionicons
                name={selectedLocation ? 'location' : 'location-outline'}
                size={20}
                color={selectedLocation ? COLORS.PRIMARY : '#6b7280'}
              />
            </View>
            <View className="flex-1">
              <Text className="text-xs font-medium text-gray-500 mb-0.5" numberOfLines={1}>
                {selectedLocation ? 'Ubicación seleccionada' : 'Ubicación actual'}
              </Text>
              <Text className="text-sm font-semibold text-gray-900" numberOfLines={1}>
                {currentLocationName}
              </Text>
            </View>
          </View>
          <View className="flex-row items-center ml-2">
            {selectedLocation && (
              <Pressable
                onPress={handleClearLocation}
                className="mr-2 w-7 h-7 rounded-full items-center justify-center bg-red-50 active:bg-red-100"
              >
                <Ionicons name="close" size={14} color="#dc2626" />
              </Pressable>
            )}
            <View className="w-8 h-8 rounded-lg items-center justify-center bg-gray-50">
              <Ionicons name="chevron-down" size={16} color="#6b7280" />
            </View>
          </View>
        </Pressable>
      </View>

      <LocationSearchModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        onSelectLocation={handleSelectLocation}
      />
    </>
  );
};
