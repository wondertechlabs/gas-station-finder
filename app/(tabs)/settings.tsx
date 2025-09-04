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
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronRight } from 'lucide-react-native';
import { Colors } from '@/constants/colors';

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
    <ChevronRight size={20} color={Colors.neutral[400]} />
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
        <View style={styles.headerSection}>
          <LinearGradient
            colors={[Colors.accent[500], Colors.primary[600]]}
            style={styles.headerGradient}
          >
            <Text style={styles.headerTitle}>Configuración</Text>
            <Text style={styles.headerSubtitle}>
              Personaliza tu experiencia
            </Text>
          </LinearGradient>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>General</Text>
          
          <SettingItem
            icon={<Ionicons name="location" size={22} color={Colors.primary[600]} />}
            title="Ubicación"
            subtitle="Permisos y precisión"
            onPress={handleLocationSettings}
          />

          <SettingItem
            icon={<Ionicons name="globe" size={22} color={Colors.secondary[600]} />}
            title="Idioma"
            subtitle="Español (Nicaragua)"
            onPress={handleLanguage}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Aplicación</Text>

          <SettingItem
            icon={<Ionicons name="shield-checkmark" size={22} color={Colors.success[600]} />}
            title="Privacidad"
            subtitle="Política de datos"
            onPress={handlePrivacy}
          />

          <SettingItem
            icon={<Ionicons name="star" size={22} color={Colors.warning[500]} />}
            title="Calificar App"
            subtitle="Déjanos tu opinión"
            onPress={handleRateApp}
          />
        </View>

        <View style={styles.footer}>
          <LinearGradient
            colors={[Colors.neutral[100], Colors.neutral[50]]}
            style={styles.footerGradient}
          >
            <Text style={styles.footerText}>
              GasFinder Managua v1.0.0
            </Text>
          </LinearGradient>
          
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
    backgroundColor: Colors.background.primary,
    paddingTop: 0,
  },
  scrollView: {
    flex: 1,
  },
  headerSection: {
    marginBottom: 16,
  },
  headerGradient: {
    padding: 24,
    paddingTop: 32,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.text.inverse,
    textAlign: 'center',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: Colors.text.inverse,
    textAlign: 'center',
    opacity: 0.9,
  },
  section: {
    backgroundColor: Colors.background.secondary,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: Colors.neutral[900],
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 6,
    borderWidth: 1,
    borderColor: Colors.neutral[100],
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text.primary,
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
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.neutral[50],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    borderWidth: 1,
    borderColor: Colors.neutral[200],
  },
  textContainer: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text.primary,
  },
  settingSubtitle: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginTop: 2,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  footerGradient: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    marginBottom: 8,
  },
  footerText: {
    fontSize: 15,
    color: Colors.text.primary,
    fontWeight: '600',
  },
  footerSubtext: {
    fontSize: 14,
    color: Colors.text.tertiary,
    fontWeight: '500',
  },
});