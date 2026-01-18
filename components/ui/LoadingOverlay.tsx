import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { COLORS } from '~/config/constants';

interface LoadingOverlayProps {
  message?: string;
  visible?: boolean;
}

export const LoadingOverlay = React.memo<LoadingOverlayProps>(
  ({ message = 'Cargando...', visible = true }) => {
    if (!visible) return null;

    return (
      <View className="absolute top-16 left-4 right-4">
        <View className="bg-white rounded-lg p-4 shadow-lg flex-row items-center">
          <ActivityIndicator size="small" color={COLORS.PRIMARY} />
          <Text className="ml-3 text-gray-700">{message}</Text>
        </View>
      </View>
    );
  },
);
