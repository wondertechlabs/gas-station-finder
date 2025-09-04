import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { GasStation } from '@/types/gasStation';
import { NavigationService } from '@/services/navigationService';
import { Marker, Callout } from 'expo-maps';
import { Fuel, Navigation } from 'lucide-react-native';

interface Props {
  station: GasStation;
}

export function GasStationMarker({ station }: Props) {
  const handleNavigate = () => {
    NavigationService.navigateToStation(station);
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
    return colors[brand || ''] || '#2563eb';
  };

  const formatDistance = (distance?: number): string => {
    if (!distance) return '';
    if (distance < 1000) {
      return `${Math.round(distance)}m`;
    }
    return `${(distance / 1000).toFixed(1)}km`;
  };

  return (
    <Marker
      coordinate={station.coordinates}
      identifier={station.id}
    >
      <View style={[styles.marker, { borderColor: getBrandColor(station.brand) }]}>
        <Fuel size={16} color="#ffffff" />
      </View>
      
      <Callout style={styles.callout}>
        <View style={styles.calloutContent}>
          <View style={styles.header}>
            <Text style={styles.stationName}>{station.name}</Text>
            {station.distance && (
              <Text style={styles.distance}>
                {formatDistance(station.distance)}
              </Text>
            )}
          </View>
          
          <Text style={styles.address}>{station.address}</Text>
          
          <View style={styles.statusRow}>
            <View style={[
              styles.statusBadge,
              { backgroundColor: station.isOpen ? '#10b981' : '#ef4444' }
            ]}>
              <Text style={styles.statusText}>
                {station.isOpen ? 'Abierto' : 'Cerrado'}
              </Text>
            </View>
            
            {station.is24Hours && (
              <View style={styles.statusBadge24}>
                <Text style={styles.statusText24}>24h</Text>
              </View>
            )}
          </View>

          <View style={styles.priceRow}>
            {station.fuelTypes.slice(0, 2).map((fuel, index) => (
              <Text key={index} style={styles.priceText}>
                {fuel.displayName}: C${fuel.price}
              </Text>
            ))}
          </View>

          <TouchableOpacity style={styles.navigateButton} onPress={handleNavigate}>
            <Navigation size={16} color="#ffffff" />
            <Text style={styles.navigateText}>Navegar</Text>
          </TouchableOpacity>
        </View>
      </Callout>
    </Marker>
  );
}

const styles = StyleSheet.create({
  marker: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#2563eb',
    borderWidth: 3,
    borderColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  callout: {
    width: 250,
  },
  calloutContent: {
    padding: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  stationName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    flex: 1,
    marginRight: 8,
  },
  distance: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  address: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
    lineHeight: 20,
  },
  statusRow: {
    flexDirection: 'row',
    marginBottom: 8,
    gap: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusBadge24: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#8b5cf6',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#ffffff',
  },
  statusText24: {
    fontSize: 12,
    fontWeight: '500',
    color: '#ffffff',
  },
  priceRow: {
    marginBottom: 12,
  },
  priceText: {
    fontSize: 13,
    color: '#374151',
    lineHeight: 18,
  },
  navigateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563eb',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 6,
  },
  navigateText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#ffffff',
  },
});