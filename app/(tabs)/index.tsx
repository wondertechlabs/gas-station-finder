import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { MapPin } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

export default function MapTab() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mapa de Estaciones</Text>
        <Text style={styles.subtitle}>Encuentra gasolineras cerca de ti</Text>
      </View>
      
      <View style={styles.mapPlaceholder}>
        <View style={styles.iconContainer}>
          <MapPin size={48} color="#2563eb" />
        </View>
        <Text style={styles.placeholderTitle}>Mapa Interactivo</Text>
        <Text style={styles.placeholderText}>
          El mapa estará disponible próximamente con todas las estaciones de servicio de Managua
        </Text>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>Características del Mapa</Text>
        <View style={styles.featureList}>
          <Text style={styles.feature}>• Ubicación en tiempo real</Text>
          <Text style={styles.feature}>• Estaciones cercanas</Text>
          <Text style={styles.feature}>• Precios actualizados</Text>
          <Text style={styles.feature}>• Navegación directa</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    padding: 20,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
  },
  mapPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    backgroundColor: '#f1f5f9',
    margin: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e2e8f0',
    borderStyle: 'dashed',
  },
  iconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#eff6ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  placeholderTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  placeholderText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  infoCard: {
    backgroundColor: '#ffffff',
    margin: 16,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 12,
  },
  featureList: {
    gap: 8,
  },
  feature: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
  },
});