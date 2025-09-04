import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { GasStation } from '@/types/gasStation';
import { Ionicons } from '@expo/vector-icons';

interface GasStationCardProps {
  station: GasStation;
}

export function GasStationCard({ station }: GasStationCardProps) {
  const handleNavigate = () => {
    Alert.alert(
      'Navegación',
      `¿Abrir navegación hacia ${station.name}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Navegar', onPress: () => console.log('Navigate to:', station.name) }
      ]
    );
  };

  const formatDistance = (distance?: number): string => {
    if (!distance) return '';
    if (distance < 1000) {
      return `${Math.round(distance)}m`;
    }
    return `${(distance / 1000).toFixed(1)}km`;
  };

  const getBrandColor = (brand?: string): string => {
    const colors: { [key: string]: string } = {
      'Shell': '#FFD320',
      'Petronic': '#E31E24',
      'Texaco': '#E31E24',
      'UNO Gas': '#0066CC',
      'Puma': '#FF6B00',
      'Esso': '#E31E24',
    };
    return colors[brand || ''] || '#6b7280';
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <View style={[styles.brandIndicator, { backgroundColor: getBrandColor(station.brand) }]} />
          <Text style={styles.stationName}>{station.name}</Text>
          {station.distance && (
            <Text style={styles.distance}>
              {formatDistance(station.distance)}
            </Text>
          )}
        </View>
        
        <View style={styles.statusRow}>
          <View style={[
            styles.statusBadge,
            { backgroundColor: station.isOpen ? '#10b981' : '#ef4444' }
          ]}>
            <Ionicons name="time" size={12} color="#ffffff" />
            <Text style={styles.statusText}>
              {station.isOpen ? 'Abierto' : 'Cerrado'}
            </Text>
          </View>
          
          {station.is24Hours && (
            <View style={styles.badge24}>
              <Text style={styles.badge24Text}>24h</Text>
            </View>
          )}
        </View>
      </View>

      <View style={styles.addressRow}>
        <Ionicons name="location" size={14} color="#6b7280" />
        <Text style={styles.address}>{station.address}</Text>
      </View>

      {station.rating && (
        <View style={styles.ratingRow}>
          <Ionicons name="star" size={14} color="#fbbf24" />
          <Text style={styles.rating}>{station.rating.toFixed(1)}</Text>
        </View>
      )}

      <View style={styles.fuelTypes}>
        {station.fuelTypes.slice(0, 3).map((fuel, index) => (
          <View key={index} style={styles.fuelChip}>
            <Ionicons name="car" size={12} color="#6b7280" />
            <Text style={styles.fuelText}>
              {fuel.displayName}: C${fuel.price}
            </Text>
          </View>
        ))}
      </View>

      <TouchableOpacity style={styles.navigateButton} onPress={handleNavigate}>
        <Ionicons name="navigate" size={16} color="#ffffff" />
        <Text style={styles.navigateText}>Navegar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    marginBottom: 12,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  brandIndicator: {
    width: 4,
    height: 20,
    borderRadius: 2,
    marginRight: 12,
  },
  stationName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    flex: 1,
  },
  distance: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  statusRow: {
    flexDirection: 'row',
    gap: 8,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#ffffff',
  },
  badge24: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#8b5cf6',
  },
  badge24Text: {
    fontSize: 12,
    fontWeight: '500',
    color: '#ffffff',
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 6,
  },
  address: {
    fontSize: 14,
    color: '#6b7280',
    flex: 1,
    lineHeight: 20,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 4,
  },
  rating: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  fuelTypes: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  fuelChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  fuelText: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '500',
  },
  navigateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563eb',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 6,
  },
  navigateText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
});