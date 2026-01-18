import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { COLORS } from '~/config/constants';

interface LoadingScreenProps {
  message?: string;
  size?: 'small' | 'large';
}

export const LoadingScreen = React.memo<LoadingScreenProps>(
  ({ message = 'Cargando...', size = 'large' }) => (
    <View className="flex-1 justify-center items-center bg-gray-50">
      <ActivityIndicator size={size} color={COLORS.PRIMARY} />
      <Text className="mt-4 text-gray-600">{message}</Text>
    </View>
  ),
);
