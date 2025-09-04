import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { GasStation } from '@/types/gasStation';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
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
    const brandKey = brand?.toLowerCase().replace(' ', '') as keyof typeof Colors.brands;
    return Colors.brands[brandKey] || Colors.brands.default;
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
            { backgroundColor: station.isOpen ? Colors.success[500] : Colors.error[500] }
          ]}>
            <Ionicons name="time" size={12} color={Colors.text.inverse} />
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
        <Ionicons name="location" size={14} color={Colors.neutral[500]} />
        <Text style={styles.address}>{station.address}</Text>
      </View>

      {station.rating && (
        <View style={styles.ratingRow}>
          <Ionicons name="star" size={14} color={Colors.warning[400]} />
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

      <LinearGradient
        colors={[Colors.primary[500], Colors.secondary[600]]}
        style={styles.navigateButton}
      >
        <TouchableOpacity style={styles.navigateButtonInner} onPress={handleNavigate}>
          <Ionicons name="navigate" size={16} color={Colors.text.inverse} />
          <Text style={styles.navigateText}>Navegar</Text>
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );
}

const getFuelColor = (type: string): string => {
  const colors: { [key: string]: string } = {
    'regular': Colors.success[500],
    'super': Colors.warning[500],
    'diesel': Colors.primary[500],
    'glp': Colors.accent[500],
  };
  return colors[type] || Colors.neutral[400];
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.background.secondary,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    marginHorizontal: 16,
    shadowColor: Colors.neutral[900],
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 1,
    borderColor: Colors.neutral[100],
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
    height: 24,
    borderRadius: 2,
    marginRight: 12,
  },
  stationName: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
    flex: 1,
  },
  distance: {
    fontSize: 14,
    color: Colors.text.tertiary,
    fontWeight: '600',
  },
  statusRow: {
    flexDirection: 'row',
    gap: 8,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.text.inverse,
  },
  badge24: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: Colors.accent[500],
  },
  badge24Text: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.text.inverse,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 6,
  },
  address: {
    fontSize: 14,
    color: Colors.text.secondary,
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
    color: Colors.text.primary,
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
    backgroundColor: Colors.neutral[50],
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 6,
    borderWidth: 1,
    borderColor: Colors.neutral[200],
  },
  fuelDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  fuelText: {
    fontSize: 13,
    color: Colors.text.primary,
    fontWeight: '600',
  },
  navigateButton: {
    borderRadius: 12,
  },
  navigateButtonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 6,
  },
  navigateText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.inverse,
  },
});