import React from 'react';
import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface EmptyStateProps {
  title: string;
  message: string;
  icon?: keyof typeof Ionicons.glyphMap;
}

export const EmptyState = React.memo<EmptyStateProps>(
  ({ title, message, icon = 'search-outline' }) => (
    <View className="flex-1 justify-center items-center px-6">
      <Ionicons name={icon} size={64} color="#9ca3af" />
      <Text className="text-lg font-semibold text-gray-900 text-center mb-2 mt-4">
        {title}
      </Text>
      <Text className="text-gray-600 text-center">{message}</Text>
    </View>
  ),
);
