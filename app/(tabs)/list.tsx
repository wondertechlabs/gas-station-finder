import { useState, useEffect } from 'react';
import {
  View,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  Text,
} from 'react-native';
import * as Location from 'expo-location';
import { GasStationService } from '~/services/gasStationService';
import { GasStation } from '~/types/gasStation';
import { GasStationCard } from '~/components/GasStationCard';

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

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Location permission denied');
      }

      let location = { latitude: 12.1364, longitude: -86.2514 };
      try {
        const currentLocation = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        location = {
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
        };
      } catch (locationError) {
        console.log('Using Managua default location');
      }

      const stations = await GasStationService.findNearby(
        location.latitude,
        location.longitude,
        10000,
      );

      if (stations.length === 0) {
        console.log('No se encontraron gasolineras reales, verificando API...');
        return;
      }

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

    const filtered = gasStations.filter(
      (station) =>
        station.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        station.brand?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        station.address.toLowerCase().includes(searchQuery.toLowerCase()),
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
        <Text className="mt-4 text-base text-slate-600 font-medium">
          Cargando estaciones...
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-slate-50">
      {gasStations.length === 0 ? (
        <View className="flex-1 justify-center items-center px-6">
          <Text className="text-lg font-semibold text-gray-900 text-center mb-2">
            No se encontraron gasolineras
          </Text>
          <Text className="text-sm text-gray-600 text-center mb-4">
            Verifica tu conexión a internet y la configuración de la API Key
          </Text>
          <Text className="text-xs text-gray-500 text-center">
            Asegúrate de que Places API esté habilitada en Google Cloud Console
          </Text>
        </View>
      ) : (
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
      )}
    </View>
  );
}
