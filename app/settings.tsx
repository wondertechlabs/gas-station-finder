import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

interface SettingItemProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  onPress: () => void;
}

const SettingItem: React.FC<SettingItemProps> = ({ 
  icon, 
  title, 
  subtitle, 
  onPress 
}) => (
  <TouchableOpacity className="flex-row items-center justify-between px-5 py-4.5" onPress={onPress}>
    <View className="flex-row items-center flex-1">
      <View className="w-11 h-11 rounded-full bg-slate-50 items-center justify-center mr-4 border border-slate-200">
        {icon}
      </View>
      <View className="flex-1">
        <Text className="text-base font-semibold text-slate-900">{title}</Text>
        {subtitle && <Text className="text-sm text-slate-600 mt-0.5">{subtitle}</Text>}
      </View>
    </View>
    <Ionicons name="chevron-forward-outline" size={20} color="#94a3b8" />
  </TouchableOpacity>
);

export default function SettingsTab() {
  const handleLocationSettings = () => {
    Alert.alert(
      'Configuración de Ubicación',
      'Administra los permisos de ubicación para la aplicación',
      [{ text: 'OK' }]
    );
  };

  const handleLanguage = () => {
    Alert.alert(
      'Idioma',
      'La aplicación está configurada en Español',
      [{ text: 'OK' }]
    );
  };

  const handlePrivacy = () => {
    Alert.alert(
      'Privacidad',
      'Información sobre cómo protegemos tus datos',
      [{ text: 'OK' }]
    );
  };

  const handleRateApp = () => {
    Alert.alert(
      'Calificar App',
      '¿Te gusta la aplicación? ¡Déjanos una reseña!',
      [
        { text: 'Más tarde', style: 'cancel' },
        { text: 'Calificar', onPress: () => console.log('Rate app') }
      ]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50 pt-0">
      <ScrollView className="flex-1">
        <View className="bg-white mx-4 my-2 rounded-2xl overflow-hidden border border-slate-200">
          <Text className="text-lg font-bold text-slate-900 px-5 pt-5 pb-3">General</Text>

          <SettingItem
            icon={<Ionicons name="location" size={22} color="#2563eb" />}
            title="Ubicación"
            subtitle="Permisos y precisión"
            onPress={handleLocationSettings}
          />

          <SettingItem
            icon={<Ionicons name="globe" size={22} color="#06b6d4" />}
            title="Idioma"
            subtitle="Español (Nicaragua)"
            onPress={handleLanguage}
          />
        </View>

        <View className="bg-white mx-4 my-2 rounded-2xl overflow-hidden border border-slate-200">
          <Text className="text-lg font-bold text-slate-900 px-5 pt-5 pb-3">Aplicación</Text>

          <SettingItem
            icon={<Ionicons name="shield-checkmark" size={22} color="#22c55e" />}
            title="Privacidad"
            subtitle="Política de datos"
            onPress={handlePrivacy}
          />

          <SettingItem
            icon={<Ionicons name="star" size={22} color="#f59e0b" />}
            title="Calificar App"
            subtitle="Déjanos tu opinión"
            onPress={handleRateApp}
          />
        </View>

        <View className="items-center py-8 px-4">
          <View className="bg-slate-50 px-6 py-3 rounded-2xl mb-3 border border-slate-200">
            <Text className="text-sm text-slate-900 font-semibold">
              GasFinder Managua v1.0.0
            </Text>
          </View>
          
          <Text className="text-sm text-slate-500 font-medium">
            Hecho con ❤️ para Nicaragua
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
