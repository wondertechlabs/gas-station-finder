import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/colors';

const { width, height } = Dimensions.get('window');

export default function MapTab() {
  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[Colors.primary[50], Colors.secondary[50]]}
        style={styles.mapPlaceholder}
      >
        <View style={styles.iconContainer}>
          <LinearGradient
            colors={[Colors.primary[500], Colors.secondary[500]]}
            style={styles.iconGradient}
          >
            <Ionicons name="map" size={48} color={Colors.text.inverse} />
          </LinearGradient>
        </View>
        <Text style={styles.placeholderTitle}>Mapa Interactivo</Text>
        <Text style={styles.placeholderText}>
          El mapa estará disponible próximamente con todas las estaciones de servicio de Managua
        </Text>
        
        <View style={styles.comingSoonBadge}>
          <Text style={styles.comingSoonText}>Próximamente</Text>
        </View>
      </LinearGradient>

      <View style={styles.infoCard}>
        <LinearGradient
          colors={[Colors.accent[500], Colors.primary[600]]}
          style={styles.titleGradient}
        >
          <Text style={styles.infoTitle}>Características del Mapa</Text>
        </LinearGradient>
        
        <View style={styles.featureList}>
          <View style={styles.featureItem}>
            <View style={[styles.featureDot, { backgroundColor: Colors.success[500] }]} />
            <Text style={styles.feature}>Ubicación en tiempo real</Text>
          </View>
          <View style={styles.featureItem}>
            <View style={[styles.featureDot, { backgroundColor: Colors.secondary[500] }]} />
            <Text style={styles.feature}>Estaciones cercanas</Text>
          </View>
          <View style={styles.featureItem}>
            <View style={[styles.featureDot, { backgroundColor: Colors.warning[500] }]} />
            <Text style={styles.feature}>Precios actualizados</Text>
          </View>
          <View style={styles.featureItem}>
            <View style={[styles.featureDot, { backgroundColor: Colors.accent[500] }]} />
            <Text style={styles.feature}>Navegación directa</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
    paddingTop: 0,
  },
  mapPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    margin: 16,
    marginTop: 8,
    borderRadius: 12,
  },
  iconContainer: {
    marginBottom: 16,
  },
  iconGradient: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text.primary,
    marginBottom: 8,
    textAlign: 'center',
  },
  placeholderText: {
    fontSize: 16,
    color: Colors.text.secondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 20,
  },
  comingSoonBadge: {
    backgroundColor: Colors.accent[100],
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.accent[300],
  },
  comingSoonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.accent[700],
  },
  infoCard: {
    backgroundColor: Colors.background.secondary,
    margin: 16,
    marginTop: 0,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: Colors.neutral[900],
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  titleGradient: {
    padding: 20,
    paddingBottom: 16,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text.inverse,
    textAlign: 'center',
  },
  featureList: {
    padding: 20,
    paddingTop: 16,
    gap: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featureDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  feature: {
    fontSize: 16,
    color: Colors.text.primary,
    lineHeight: 24,
    fontWeight: '500',
  },
});