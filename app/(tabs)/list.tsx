import React, { useState, useEffect } from 'react';
import { 
  View, 
  FlatList, 
  StyleSheet, 
  RefreshControl,
  ActivityIndicator,
  Text 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GasStationService } from '@/services/gasStationService';
import { GasStation } from '@/types/gasStation';
import { GasStationCard } from '@/components/GasStationCard';
import { SearchBar } from '@/components/SearchBar';
import { Colors } from '@/constants/colors';

export default function ListTab() {
  const [gasStations, setGasStations] = useState<GasStation[]>([]);
  const [filteredStations, setFilteredStations] = useState<GasStation[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadGasStations();
  }, []);

  useEffect(() => {
    filterStations();
  }, [searchQuery, gasStations]);

  const loadGasStations = async () => {
    try {
      setLoading(true);
      const stations = await GasStationService.findNearby();
      setGasStations(stations);
    } catch (error) {
      console.error('Error loading gas stations:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadGasStations();
    setRefreshing(false);
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
    
    setFilteredStations(filtered);
  };

  const renderGasStation = ({ item }: { item: GasStation }) => (
    <GasStationCard station={item} />
  );

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: Colors.background.primary }]}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={styles.loadingText}>Cargando estaciones...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Buscar estaciones..."
      />
      
      <FlatList
        data={filteredStations}
        renderItem={renderGasStation}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#2563eb']}
          />
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  listContainer: {
    paddingTop: 0,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: Colors.text.secondary,
    fontWeight: '500',
  },
});