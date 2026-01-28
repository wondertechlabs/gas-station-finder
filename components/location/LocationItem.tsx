import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LocationResult } from '~/types/location';
import { COLORS } from '~/config/constants';

interface LocationItemProps {
  location: LocationResult;
  onPress: () => void;
  iconColor?: string;
  iconName?: keyof typeof Ionicons.glyphMap;
}

export const LocationItem = React.memo<LocationItemProps>(
  ({
    location,
    onPress,
    iconColor = COLORS.PRIMARY,
    iconName = 'location',
  }) => (
    <Pressable
      onPress={onPress}
      className="flex-row items-center p-4 bg-white border-b border-gray-100 active:bg-gray-50"
    >
      <View
        className="w-10 h-10 rounded-lg items-center justify-center mr-3"
        style={{ backgroundColor: iconColor }}
      >
        <Ionicons name={iconName} size={18} color="white" />
      </View>
      <View className="flex-1">
        <Text className="text-base font-semibold text-gray-900">
          {location.name}
        </Text>
        <Text className="text-sm text-gray-600" numberOfLines={1}>
          {location.address}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color="#9ca3af" />
    </Pressable>
  ),
);

LocationItem.displayName = 'LocationItem';
