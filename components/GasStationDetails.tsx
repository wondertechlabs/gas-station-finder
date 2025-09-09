import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GasStation } from '~/types/gasStation';

interface GasStationDetailsProps {
  station: GasStation;
  onClose: () => void;
  onNavigate: (station: GasStation, app: 'google' | 'waze') => void;
  onCall: (phone: string) => void;
}

export const GasStationDetails = React.memo<GasStationDetailsProps>(
  ({ station, onClose, onNavigate, onCall }) => {
    const handleNavigatePress = () => {
      console.log('Navigate button pressed');
      Alert.alert(
        'Elegir App de Navegación',
        `¿Cómo quieres navegar a ${station.name}?`,
        [
          {
            text: 'Google Maps',
            onPress: () => onNavigate(station, 'google'),
          },
          {
            text: 'Waze',
            onPress: () => onNavigate(station, 'waze'),
          },
          {
            text: 'Cancelar',
            style: 'cancel',
          },
        ]
      );
    };

    return (
      <>
        <View className="absolute bottom-4 left-4 right-4">
          <View className="bg-white rounded-xl shadow-lg p-4">
            <View className="flex-row justify-between items-start mb-3">
              <View className="flex-1">
                <Text className="text-lg font-semibold text-gray-900">
                  {station.name}
                </Text>
                <Text className="text-sm text-gray-600 mb-1">
                  {station.brand}
                </Text>
                <Text className="text-sm text-gray-500">{station.address}</Text>
              </View>
              <TouchableOpacity onPress={onClose} className="p-1">
                <Ionicons name="close" size={18} color="#6b7280" />
              </TouchableOpacity>
            </View>

            <View className="flex-row items-center mb-3">
              <View className="flex-row items-center mr-4">
                <Ionicons
                  name={station.isOpen ? 'checkmark-circle' : 'close-circle'}
                  size={16}
                  color={station.isOpen ? '#22C55E' : '#ef4444'}
                />
                <Text className="ml-1 text-sm text-gray-600">
                  {station.isOpen ? 'Abierto' : 'Cerrado'}
                </Text>
              </View>
              {station.rating && (
                <View className="flex-row items-center">
                  <Ionicons name="star" size={16} color="#fbbf24" />
                  <Text className="ml-1 text-sm text-gray-600">
                    {station.rating.toFixed(1)}
                  </Text>
                </View>
              )}
            </View>

            <View className="flex-row space-x-3">
              <TouchableOpacity
                onPress={handleNavigatePress}
                className="flex-1 bg-green-500 py-3 rounded-lg flex-row items-center justify-center"
              >
                <Ionicons name="navigate" size={16} color="white" />
                <Text className="text-white font-semibold ml-2">Navegar</Text>
              </TouchableOpacity>

              {station.phone && (
                <TouchableOpacity
                  onPress={() => onCall(station.phone!)}
                  className="flex-1 bg-blue-500 py-3 rounded-lg flex-row items-center justify-center"
                >
                  <Ionicons name="call" size={16} color="white" />
                  <Text className="text-white font-semibold ml-2">Llamar</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </>
    );
  },
);
