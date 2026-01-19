import { useCallback, useMemo } from 'react';
import { Alert, ScrollView, View, Text, Pressable, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SettingItem } from '~/components/settings/SettingItem';
import { useLocationStore } from '~/stores/locationStore';
import { COLORS } from '~/config/constants';

export default function SettingsTab() {
  const {
    selectedLocation,
    address,
    isLoading,
    error,
    hasPermission,
    clearSelectedLocation,
  } = useLocationStore();

  const locationText = useMemo(() => {
    if (selectedLocation) return selectedLocation.name;
    if (error) return error;
    if (address) return address;
    if (!hasPermission) return 'Permisos requeridos';
    return 'Ubicación no disponible';
  }, [selectedLocation, error, address, hasPermission]);

  const handleLocationPress = useCallback(() => {
    router.push('/(tabs)/search');
  }, []);

  return (
    <ScrollView className="flex-1 bg-gray-50" showsVerticalScrollIndicator={false}>
      <View className="bg-white mx-4 mt-4 mb-4 rounded-xl">
        <View className="px-4 py-3 border-b border-gray-100">
          <Text className="text-base font-semibold text-gray-900">General</Text>
        </View>
        <Pressable
          onPress={handleLocationPress}
          className="flex-row items-center px-4 py-4 active:bg-gray-50"
          disabled={isLoading}
        >
          <View className="w-10 h-10 rounded-lg items-center justify-center mr-3 bg-blue-100">
            {isLoading ? (
              <ActivityIndicator size="small" color={COLORS.PRIMARY} />
            ) : (
              <Ionicons name="location" size={20} color={COLORS.PRIMARY} />
            )}
          </View>
          <View className="flex-1">
            <Text className="text-sm font-medium text-gray-900 mb-1">Ubicación</Text>
            <Text
              className={`text-xs ${error ? 'text-red-600' : !hasPermission ? 'text-orange-600' : 'text-gray-600'}`}
              numberOfLines={1}
            >
              {locationText}
            </Text>
          </View>
          {selectedLocation && (
            <Pressable
              onPress={(e) => {
                e.stopPropagation();
                clearSelectedLocation();
              }}
              className="mr-2 p-1"
            >
              <Ionicons name="close" size={18} color="#9ca3af" />
            </Pressable>
          )}
          <Ionicons name="chevron-forward" size={18} color="#9ca3af" />
        </Pressable>
      </View>

      <View className="bg-white mx-4 mb-4 rounded-xl">
        <View className="px-4 py-3 border-b border-gray-100">
          <Text className="text-base font-semibold text-gray-900">Aplicación</Text>
        </View>
        <SettingItem
          icon={<Ionicons name="shield-checkmark" size={24} color="#22c55e" />}
          title="Privacidad"
          subtitle="Política de datos"
          onPress={() => Alert.alert('Privacidad', 'Información sobre cómo protegemos tus datos', [{ text: 'OK' }])}
        />
        <SettingItem
          icon={<Ionicons name="star" size={24} color="#f59e0b" />}
          title="Calificar App"
          subtitle="Déjanos tu opinión"
          onPress={() =>
            Alert.alert('Calificar App', '¿Te gusta la aplicación? ¡Déjanos una reseña!', [
              { text: 'Más tarde', style: 'cancel' },
              { text: 'Calificar', onPress: () => { } },
            ])
          }
        />
      </View>

      <View className="items-center py-6">
        <Text className="text-sm text-gray-500 text-center">
          Gas Station Finder v1.0.0
        </Text>
        <Text className="text-xs text-gray-400 text-center mt-2">
          Hecho con ♥ para Nicaragua
        </Text>
      </View>
    </ScrollView>
  );
}
