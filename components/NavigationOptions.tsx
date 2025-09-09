import React from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GasStation } from '~/types/gasStation';

interface NavigationOptionsProps {
  visible: boolean;
  station: GasStation | null;
  onClose: () => void;
  onNavigate: (station: GasStation, app: 'google' | 'waze') => void;
}

export const NavigationOptions = React.memo<NavigationOptionsProps>(
  ({ visible, station, onClose, onNavigate }) => {
    if (!station) return null;

    const handleGoogleMaps = () => {
      onNavigate(station, 'google');
      onClose();
    };

    const handleWaze = () => {
      onNavigate(station, 'waze');
      onClose();
    };

    return (
      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={onClose}
      >
        <View className="flex-1 bg-black/50 justify-center items-center px-6">
          <View className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <Text className="text-xl font-semibold text-gray-900 text-center mb-2">
              Elegir App de Navegación
            </Text>
            <Text className="text-gray-600 text-center mb-6">
              {station.name}
            </Text>

            <View className="space-y-3">
              <TouchableOpacity
                onPress={handleGoogleMaps}
                className="flex-row items-center p-4 bg-red-50 rounded-xl border border-red-100"
              >
                <View className="w-12 h-12 bg-red-500 rounded-full items-center justify-center mr-4">
                  <Ionicons name="map" size={24} color="white" />
                </View>
                <View className="flex-1">
                  <Text className="text-lg font-semibold text-gray-900">
                    Google Maps
                  </Text>
                  <Text className="text-sm text-gray-600">
                    Navegación con Google Maps
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#6b7280" />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleWaze}
                className="flex-row items-center p-4 bg-blue-50 rounded-xl border border-blue-100"
              >
                <View className="w-12 h-12 bg-blue-500 rounded-full items-center justify-center mr-4">
                  <Ionicons name="navigate" size={24} color="white" />
                </View>
                <View className="flex-1">
                  <Text className="text-lg font-semibold text-gray-900">
                    Waze
                  </Text>
                  <Text className="text-sm text-gray-600">
                    Navegación con Waze
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#6b7280" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              onPress={onClose}
              className="mt-6 py-3 bg-gray-100 rounded-xl"
            >
              <Text className="text-center text-gray-700 font-medium">
                Cancelar
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  },
);
