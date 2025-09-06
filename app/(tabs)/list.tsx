import { useState, useEffect } from 'react';
import { 
  View, 
  FlatList, 
  RefreshControl,
  ActivityIndicator,
  Text 
} from 'react-native';
import { GasStationService } from '~/services/gasStationService';
import { GasStation } from '~/types/gasStation';
import { GasStationCard } from '~/components/GasStationCard';
import { SearchBar } from '~/components/SearchBar';

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
      <View className="flex-1 justify-center items-center bg-slate-50">
        <ActivityIndicator size="large" color="#2563eb" />
        <Text className="mt-4 text-base text-slate-600 font-medium">Cargando estaciones...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-slate-50">
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
    </View>
  );
}
