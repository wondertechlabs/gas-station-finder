import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Alert, Dimensions, Platform, Text } from 'react-native';
import * as Location from 'expo-location';
import { GasStationService } from '@/services/gasStationService';
import { GasStation } from '@/types/gasStation';
import { GasStationMarker } from '@/components/GasStationMarker';
import { SearchRadius } from '@/components/SearchRadius';
import { LocationButton } from '@/components/LocationButton';

import { ExpoMap } from 'expo-maps';

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

interface Region {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

export default function MapTab() {
  const isMounted = useRef(true);
  const [region, setRegion] = useState<Region>(MANAGUA_CENTER);
  const [userLocation, setUserLocation] = useState<Location.LocationObject | null>(null);
  const [gasStations, setGasStations] = useState<GasStation[]>([]);
  const [searchRadius, setSearchRadius] = useState(5000); // 5km default
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    isMounted.current = true;
    getCurrentLocation();
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (userLocation) {
      searchNearbyGasStations();
    } else {
      // Load stations for Managua center if no user location
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

  return (
    <View style={styles.container}>
      <ExpoMap
        style={styles.map}
        initialRegion={region}
        showUserLocation={true}
      >
        {gasStations.map((station) => (
          <GasStationMarker
            key={station.id}
            station={station}
          />
        ))}
      </ExpoMap>

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
});