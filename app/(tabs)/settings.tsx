import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { MapPin, Globe, Shield, Star, ChevronRight } from 'lucide-react-native';

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
  <TouchableOpacity style={styles.settingItem} onPress={onPress}>
    <View style={styles.settingLeft}>
      <View style={styles.iconContainer}>
        {icon}
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.settingTitle}>{title}</Text>
        {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
      </View>
    </View>
    <ChevronRight size={20} color="#9ca3af" />
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
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>General</Text>
          
          <SettingItem
            icon={<Ionicons name="location" size={22} color="#2563eb" />}
            title="Ubicación"
            subtitle="Permisos y precisión"
            onPress={handleLocationSettings}
          />

          <SettingItem
            icon={<Ionicons name="globe" size={22} color="#2563eb" />}
            title="Idioma"
            subtitle="Español (Nicaragua)"
            onPress={handleLanguage}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Aplicación</Text>

          <SettingItem
            icon={<Ionicons name="shield-checkmark" size={22} color="#2563eb" />}
            title="Privacidad"
            subtitle="Política de datos"
            onPress={handlePrivacy}
          />

          <SettingItem
            icon={<Ionicons name="star" size={22} color="#2563eb" />}
            title="Calificar App"
            subtitle="Déjanos tu opinión"
            onPress={handleRateApp}
          />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            GasFinder Managua v1.0.0
          </Text>
          <Text style={styles.footerSubtext}>
            Hecho con ❤️ para Nicaragua
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    paddingTop: 0,
  },
  scrollView: {
    flex: 1,
    paddingTop: 8,
  },
  section: {
    marginTop: 24,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#e2e8f0',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#f8fafc',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#eff6ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1e293b',
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 2,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  footerText: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  footerSubtext: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 4,
  },
});