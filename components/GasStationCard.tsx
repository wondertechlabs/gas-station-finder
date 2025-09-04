import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { GasStation } from '@/types/gasStation';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';

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
    let brandKey: string;
    if (brand === 'UNO Gas') {
      brandKey = 'uno';
    } else {
      brandKey = brand?.toLowerCase().replace(/\s+/g, '') || 'default';
    }
    const typedBrandKey = brandKey as keyof typeof Colors.brands;
    return Colors.brands[typedBrandKey] || Colors.brands.default;
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
            { backgroundColor: station.isOpen ? Colors.success : Colors.error }
          ]}>
            <Ionicons name="time" size={12} color={Colors.textInverse} />
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
        <Ionicons name="location" size={14} color={Colors.gray500} />
        <Text style={styles.address}>{station.address}</Text>
      </View>

      {station.rating && (
        <View style={styles.ratingRow}>
          <Ionicons name="star" size={14} color={Colors.warning} />
          <Text style={styles.rating}>{station.rating.toFixed(1)}</Text>
        </View>
      )}

      <View style={styles.fuelTypes}>
        {station.fuelTypes.slice(0, 3).map((fuel, index) => (
          <View key={index} style={styles.fuelChip}>
            <View style={[styles.fuelDot, { backgroundColor: getFuelColor(fuel.type) }]} />
            <Text style={styles.fuelText}>
              {fuel.displayName}: C${fuel.price}
            </Text>
          </View>
        ))}
      </View>

      <TouchableOpacity style={styles.navigateButton} onPress={handleNavigate}>
        <Ionicons name="navigate" size={18} color={Colors.textInverse} />
        <Text style={styles.navigateText}>Navegar</Text>
      </TouchableOpacity>
    </View>
  );
}

const getFuelColor = (type: string): string => {
  const colors: { [key: string]: string } = {
    'regular': Colors.success,
    'super': Colors.warning,
    'diesel': Colors.primary,
    'glp': Colors.accent,
  };
  return colors[type] || Colors.gray400;
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.background,
    borderRadius: 20,
    padding: 20,
    marginBottom: 12,
    marginHorizontal: 16,
    borderWidth: 1,
    borderColor: Colors.gray200,
  },
  header: {
    marginBottom: 16,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  brandIndicator: {
    width: 4,
    height: 28,
    borderRadius: 2,
    marginRight: 16,
  },
  stationName: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
    flex: 1,
  },
  distance: {
    fontSize: 14,
    color: Colors.textTertiary,
    fontWeight: '600',
  },
  statusRow: {
    flexDirection: 'row',
    gap: 8,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textInverse,
  },
  badge24: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: Colors.accent,
  },
  badge24Text: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textInverse,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  address: {
    fontSize: 15,
    color: Colors.textSecondary,
    flex: 1,
    lineHeight: 22,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 6,
  },
  rating: {
    fontSize: 15,
    color: Colors.text,
    fontWeight: '600',
  },
  fuelTypes: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  fuelChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.gray50,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    gap: 8,
    borderWidth: 1,
    borderColor: Colors.gray200,
  },
  fuelDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  fuelText: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: '600',
  },
  navigateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 16,
    gap: 8,
  },
  navigateText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textInverse,
  },
});