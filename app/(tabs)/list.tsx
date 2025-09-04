import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  FlatList, 
  StyleSheet, 
  RefreshControl,
  Text,
  ActivityIndicator 
} from 'react-native';
import { GasStationService } from '@/services/gasStationService';
import { GasStation } from '@/types/gasStation';
import { GasStationCard } from '@/components/GasStationCard';
import { SearchBar } from '@/components/SearchBar';
import { EmptyState } from '@/components/EmptyState';
import * as Location from 'expo-location';
import { Platform } from 'react-native';

// Managua center coordinates
const MANAGUA_CENTER = {
  latitude: 12.1364,
  longitude: -86.2514,
};

export default function ListTab() {
  const isMounted = useRef(true);
  const [gasStations, setGasStations] = useState<GasStation[]>([]);
  const [filteredStations, setFilteredStations] = useState<GasStation[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [userLocation, setUserLocation] = useState<Location.LocationObject | null>(null);

  useEffect(() => {
    isMounted.current = true;
    loadGasStations();
    if (Platform.OS !== 'web') {
      getCurrentLocation();
    }
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    filterStations();
  }, [searchQuery, gasStations]);

  const getCurrentLocation = async () => {
    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      if (isMounted.current) {
        setUserLocation(location);
      }
    } catch (error) {
      console.error('Error getting location:', error);
    }
  };

  const loadGasStations = async () => {
    try {
      if (isMounted.current) {
        setLoading(true);
      }
      
      let latitude = MANAGUA_CENTER.latitude;
      let longitude = MANAGUA_CENTER.longitude;
      
      if (Platform.OS !== 'web') {
        try {
          const location = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.High,
          });
          latitude = location.coords.latitude;
          longitude = location.coords.longitude;
        } catch (error) {
          console.error('Error getting location, using Managua center:', error);
        }
      }
      
      const stations = await GasStationService.findNearby(
        latitude,
        longitude,
        10000 // 10km radius for list view
      );
      
      if (isMounted.current) {
        setGasStations(stations);
      }
    } catch (error) {
      console.error('Error loading gas stations:', error);
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  };

  const onRefresh = async () => {
    if (isMounted.current) {
      setRefreshing(true);
    }
    await loadGasStations();
    if (isMounted.current) {
      setRefreshing(false);
    }
  };

  const filterStations = () => {
    if (!searchQuery.trim()) {
      setFilteredStations(gasStations);
      return;
    }

    const filtered = gasStations.filter(station =>
      station.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      station.brand?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      station.address.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    if (isMounted.current) {
      setFilteredStations(filtered);
    }
  };

  const renderGasStation = ({ item }: { item: GasStation }) => (
    <GasStationCard
      station={item}
      userLocation={userLocation}
    />
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={styles.loadingText}>Cargando estaciones...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Buscar estaciones..."
      />
      
      <FlatList
        data={filteredStations}
        renderItem={renderGasStation}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#2563eb']}
          />
        }
        ListEmptyComponent={
          <EmptyState
            title="No se encontraron estaciones"
            subtitle="Intenta ampliar tu búsqueda o verifica tu conexión"
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  listContainer: {
    padding: 16,
    paddingTop: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#64748b',
  },
});