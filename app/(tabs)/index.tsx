import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Alert, Dimensions, Platform, Text } from 'react-native';
import * as Location from 'expo-location';
import { Region } from 'react-native-maps';
import { GasStationService } from '@/services/gasStationService';
import { GasStation } from '@/types/gasStation';
import { GasStationMarker } from '@/components/GasStationMarker';
import { SearchRadius } from '@/components/SearchRadius';
import { LocationButton } from '@/components/LocationButton';

// Conditionally import MapView only for native platforms
let MapView: any = null;
if (Platform.OS !== 'web') {
  MapView = require('react-native-maps').default;
}

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.02;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

// Managua center coordinates
const MANAGUA_CENTER = {
  latitude: 12.1364,
  longitude: -86.2514,
  latitudeDelta: LATITUDE_DELTA,
  longitudeDelta: LONGITUDE_DELTA,
};

export default function MapTab() {
  const isMounted = useRef(true);
  const [region, setRegion] = useState<Region>(MANAGUA_CENTER);
  const [userLocation, setUserLocation] = useState<Location.LocationObject | null>(null);
  const [gasStations, setGasStations] = useState<GasStation[]>([]);
  const [searchRadius, setSearchRadius] = useState(5000); // 5km default
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    isMounted.current = true;
    if (Platform.OS !== 'web') {
      getCurrentLocation();
    }
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (userLocation || Platform.OS === 'web') {
      searchNearbyGasStations();
    }
  }, [userLocation, searchRadius]);

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permisos requeridos',
          'Esta aplicación necesita acceso a tu ubicación para encontrar estaciones de servicio cercanas.'
        );
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      if (isMounted.current) {
        setUserLocation(location);
        setRegion({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        });
      }
    } catch (error) {
      console.error('Error getting location:', error);
      Alert.alert(
        'Error de ubicación',
        'No se pudo obtener tu ubicación actual. Usando ubicación de Managua.'
      );
    }
  };

  const searchNearbyGasStations = async (lat?: number, lng?: number) => {
    const latitude = lat || userLocation?.coords.latitude || MANAGUA_CENTER.latitude;
    const longitude = lng || userLocation?.coords.longitude || MANAGUA_CENTER.longitude;

    if (isMounted.current) {
      setLoading(true);
    }
    try {
      const stations = await GasStationService.findNearby(
        latitude,
        longitude,
        searchRadius
      );
      if (isMounted.current) {
        setGasStations(stations);
      }
    } catch (error) {
      console.error('Error searching gas stations:', error);
      Alert.alert(
        'Error de búsqueda',
        'No se pudieron cargar las estaciones de servicio. Intenta nuevamente.'
      );
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  };

  const onRegionChange = (newRegion: Region) => {
    setRegion(newRegion);
  };

  // Web fallback component
  if (Platform.OS === 'web') {
    return (
      <View style={styles.container}>
        <View style={styles.webFallback}>
          <Text style={styles.webFallbackTitle}>
            Mapa de Estaciones de Servicio
          </Text>
          <Text style={styles.webFallbackText}>
            La funcionalidad del mapa está disponible en dispositivos móviles.
            Para la mejor experiencia, usa la aplicación en tu teléfono.
          </Text>
          <Text style={styles.webFallbackSubtext}>
            Ubicación actual: Managua, Nicaragua
          </Text>
        </View>
        
        <SearchRadius
          radius={searchRadius}
          onRadiusChange={setSearchRadius}
          loading={loading}
        />

        <LocationButton
          onPress={getCurrentLocation}
          loading={loading}
        />
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={region}
        onRegionChange={onRegionChange}
        showsUserLocation={true}
        showsMyLocationButton={false}
        provider="google"
      >
        {gasStations.map((station) => (
          <GasStationMarker
            key={station.id}
            station={station}
          />
        ))}
      </MapView>

      <SearchRadius
        radius={searchRadius}
        onRadiusChange={setSearchRadius}
        loading={loading}
      />

      <LocationButton
        onPress={getCurrentLocation}
        loading={loading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  webFallback: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  webFallbackTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  webFallbackText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 24,
  },
  webFallbackSubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
});