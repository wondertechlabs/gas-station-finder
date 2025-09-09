import React from 'react';
import { Alert, ScrollView, View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SettingItem } from '~/components/SettingItem';
import { useLocationStore } from '~/stores/locationStore';

export default function SettingsTab() {
  
  const { 
    userLocation, 
    selectedLocation,
    address, 
    isLoading, 
    error, 
    hasPermission, 
    getCurrentLocation, 
    clearSelectedLocation,
    clearError 
  } = useLocationStore();

  const handleLocationSettings = () => {
    Alert.alert(
      'Configuración de Ubicación',
      'Para cambiar la ubicación, toca el indicador de ubicación en el mapa principal.',
      [{ text: 'OK' }]
    );
  };

  const handleLanguage = () => {
    Alert.alert('Idioma', 'La aplicación está configurada en Español', [
      { text: 'OK' },
    ]);
  };

  const handlePrivacy = () => {
    Alert.alert('Privacidad', 'Información sobre cómo protegemos tus datos', [
      { text: 'OK' },
    ]);
  };

  const handleRateApp = () => {
    Alert.alert(
      'Calificar App',
      '¿Te gusta la aplicación? ¡Déjanos una reseña!',
      [
        { text: 'Más tarde', style: 'cancel' },
        { text: 'Calificar', onPress: () => console.log('Rate app') },
      ],
    );
  };

  return (
    <ScrollView
      className="flex-1 bg-gradient-to-b pt-4 from-slate-50 to-slate-100"
      showsVerticalScrollIndicator={false}
    >
      <View
        className="bg-white mx-4 mb-6 rounded-3xl overflow-hidden"
        style={{
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.08,
          shadowRadius: 12,
          elevation: 4,
        }}
      >
        <View
          className="px-6 pt-8 pb-4"
          style={{
            backgroundColor:
              'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
          }}
        >
          <Text className="text-2xl font-bold text-slate-900 mb-2">
            General
          </Text>
          <Text className="text-sm text-slate-600 font-medium">
            Configuración básica de la aplicación
          </Text>
        </View>

        <View className="px-6 py-4 border-b border-gray-100">
          <TouchableOpacity
            onPress={handleLocationSettings}
            className="flex-row items-center"
            disabled={isLoading}
          >
            <View className="w-12 h-12 bg-blue-100 rounded-xl items-center justify-center mr-4">
              {isLoading ? (
                <ActivityIndicator size="small" color="#2563eb" />
              ) : (
                <Ionicons name="location" size={24} color="#2563eb" />
              )}
            </View>
            <View className="flex-1">
              <Text className="text-lg font-semibold text-gray-900 mb-1">
                {selectedLocation ? 'Ubicación Seleccionada' : 'Ubicación Actual'}
              </Text>
              {selectedLocation ? (
                <>
                  <Text className="text-sm text-gray-600 mb-1" numberOfLines={2}>
                    {selectedLocation.name}
                  </Text>
                  <Text className="text-xs text-gray-500">
                    {selectedLocation.address}
                  </Text>
                </>
              ) : error ? (
                <Text className="text-sm text-red-600 mb-1">
                  {error}
                </Text>
              ) : address ? (
                <Text className="text-sm text-gray-600 mb-1" numberOfLines={2}>
                  {address}
                </Text>
              ) : hasPermission ? (
                <Text className="text-sm text-gray-500 mb-1">
                  Ubicación no disponible
                </Text>
              ) : (
                <Text className="text-sm text-orange-600 mb-1">
                  Permisos de ubicación requeridos
                </Text>
              )}
              {userLocation && !selectedLocation && (
                <Text className="text-xs text-gray-500">
                  {userLocation.latitude.toFixed(4)}, {userLocation.longitude.toFixed(4)}
                </Text>
              )}
              {selectedLocation && (
                <Text className="text-xs text-gray-500">
                  {selectedLocation.latitude.toFixed(4)}, {selectedLocation.longitude.toFixed(4)}
                </Text>
              )}
            </View>
            <View className="flex-row items-center">
              {selectedLocation && (
                <TouchableOpacity
                  onPress={clearSelectedLocation}
                  className="mr-3 p-2 bg-red-50 rounded-full"
                >
                  <Ionicons name="close" size={16} color="#dc2626" />
                </TouchableOpacity>
              )}
              <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
            </View>
          </TouchableOpacity>
        </View>

        <SettingItem
          icon={<Ionicons name="globe" size={28} color="#06b6d4" />}
          title="Idioma"
          subtitle="Español (Nicaragua)"
          onPress={handleLanguage}
        />
      </View>

      <View
        className="bg-white mx-4 mb-8 rounded-3xl overflow-hidden"
        style={{
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.08,
          shadowRadius: 12,
          elevation: 4,
        }}
      >
        <View
          className="px-6 pt-8 pb-4"
          style={{
            backgroundColor:
              'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
          }}
        >
          <Text className="text-2xl font-bold text-slate-900 mb-2">
            Aplicación
          </Text>
          <Text className="text-sm text-slate-600 font-medium">
            Configuración de la app
          </Text>
        </View>

        <SettingItem
          icon={<Ionicons name="shield-checkmark" size={28} color="#22c55e" />}
          title="Privacidad"
          subtitle="Política de datos"
          onPress={handlePrivacy}
        />

        <SettingItem
          icon={<Ionicons name="star" size={28} color="#f59e0b" />}
          title="Calificar App"
          subtitle="Déjanos tu opinión"
          onPress={handleRateApp}
        />
      </View>

      <View className="items-center px-6">
        <View
          className="bg-gradient-to-r from-blue-50 to-indigo-50 px-10 py-6 rounded-3xl mb-6"
          style={{
            shadowColor: '#3b82f6',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 3,
          }}
        >
          <Text className="text-lg text-slate-800 font-bold text-center mb-1">
            GasFinder Managua v1.0.0
          </Text>
          <Text className="text-sm text-slate-600 text-center">
            Aplicación de estaciones de servicio
          </Text>
        </View>

        <Text className="text-base text-slate-500 font-medium text-center">
          Hecho con ❤️ para Nicaragua
        </Text>
      </View>
    </ScrollView>
  );
}
