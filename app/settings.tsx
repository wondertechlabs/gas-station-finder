import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '~/constants/colors';

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
    <Ionicons name="chevron-forward-outline" size={20} color={Colors.gray400} />
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
    <ScrollView style={styles.scrollView}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>General</Text>

        <SettingItem
          icon={<Ionicons name="location" size={22} color={Colors.primary} />}
          title="Ubicación"
          subtitle="Permisos y precisión"
          onPress={handleLocationSettings}
        />

        <SettingItem
          icon={<Ionicons name="globe" size={22} color={Colors.secondary} />}
          title="Idioma"
          subtitle="Español (Nicaragua)"
          onPress={handleLanguage}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Aplicación</Text>

        <SettingItem
          icon={<Ionicons name="shield-checkmark" size={22} color={Colors.success} />}
          title="Privacidad"
          subtitle="Política de datos"
          onPress={handlePrivacy}
        />

        <SettingItem
          icon={<Ionicons name="star" size={22} color={Colors.warning} />}
          title="Calificar App"
          subtitle="Déjanos tu opinión"
          onPress={handleRateApp}
        />
      </View>

      <View style={styles.footer}>
        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>
            GasFinder Managua v1.0.0
          </Text>
        </View>

        <Text style={styles.footerSubtext}>
          Hecho con ❤️ para Nicaragua
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({

  scrollView: {
    flex: 1,
  },
  section: {
    backgroundColor: Colors.background,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.gray200,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 18,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.gray50,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    borderWidth: 1,
    borderColor: Colors.gray200,
  },
  textContainer: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  settingSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 16,
  },
  footerContainer: {
    backgroundColor: Colors.gray50,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.gray200,
  },
  footerText: {
    fontSize: 15,
    color: Colors.text,
    fontWeight: '600',
  },
  footerSubtext: {
    fontSize: 14,
    color: Colors.textTertiary,
    fontWeight: '500',
  },
});