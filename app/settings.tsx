import React from 'react';
import { Alert, ScrollView, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SettingItem } from '~/components/SettingItem';

export default function SettingsTab() {
  const handleLocationSettings = () => {
    Alert.alert(
      'Configuración de Ubicación',
      'Administra los permisos de ubicación para la aplicación',
      [{ text: 'OK' }],
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

        <SettingItem
          icon={<Ionicons name="location" size={28} color="#2563eb" />}
          title="Ubicación"
          subtitle="Permisos y precisión"
          onPress={handleLocationSettings}
        />

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
