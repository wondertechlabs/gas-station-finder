import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocationStore } from '~/stores/locationStore';

interface LocationIndicatorProps {
  onPress?: () => void;
}

export const LocationIndicator = ({ onPress }: LocationIndicatorProps) => {
  const { selectedLocation, userLocation, address } = useLocationStore();

  const currentLocation = selectedLocation || userLocation;
  const locationName = selectedLocation?.name || address || 'Ubicación actual';

  return (
    <TouchableOpacity
      onPress={onPress}
      className="flex-row items-center bg-blue-50 px-3 py-2 rounded-full border border-blue-200"
      disabled={!onPress}
    >
      <Ionicons 
        name={selectedLocation ? "location" : "location-outline"} 
        size={16} 
        color="#2563eb" 
      />
      <Text className="text-sm font-medium text-blue-700 ml-2" numberOfLines={1}>
        {locationName}
      </Text>
      {onPress && (
        <Ionicons name="chevron-down" size={14} color="#2563eb" className="ml-1" />
      )}
    </TouchableOpacity>
  );
};
