import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ErrorScreenProps {
  title: string;
  message: string;
  onRetry?: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
}

export const ErrorScreen = React.memo<ErrorScreenProps>(
  ({ title, message, onRetry, icon = 'alert-circle-outline' }) => (
    <View className="flex-1 justify-center items-center bg-gray-50 px-6">
      <Ionicons name={icon} size={64} color="#ef4444" />
      <Text className="text-xl font-semibold text-gray-900 text-center mb-2 mt-4">
        {title}
      </Text>
      <Text className="text-gray-600 text-center mb-6">{message}</Text>
      {onRetry && (
        <Pressable
          className="bg-primary-500 px-6 py-3 rounded-lg"
          onPress={onRetry}
        >
          <Text className="text-white font-semibold">Reintentar</Text>
        </Pressable>
      )}
    </View>
  ),
);
