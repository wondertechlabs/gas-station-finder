import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GasStationCard } from '~/components/GasStationCard';
import { useGasStations } from '~/hooks/useGasStations';
import { useLocation } from '~/hooks/useLocation';

export default function ListTab() {
  const [searchQuery, setSearchQuery] = useState('');
  const { isLoading: locationLoading, error: locationError } = useLocation();
  const { filteredStations, isLoading, error } = useGasStations();

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const filteredBySearch = filteredStations.filter(
    (station) =>
      station.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      station.brand?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      station.address.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  if (locationLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#22C55E" />
        <Text className="mt-4 text-gray-600">Obteniendo ubicación...</Text>
      </View>
    );
  }

  if (locationError) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50 px-6">
        <Ionicons name="location-outline" size={64} color="#ef4444" />
        <Text className="text-xl font-semibold text-gray-900 text-center mb-2 mt-4">
          Error de Ubicación
        </Text>
        <Text className="text-gray-600 text-center mb-6">{locationError}</Text>
        <TouchableOpacity
          className="bg-green-500 px-6 py-3 rounded-lg"
          onPress={() => window.location.reload()}
        >
          <Text className="text-white font-semibold">Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50 px-6">
        <Ionicons name="alert-circle-outline" size={64} color="#ef4444" />
        <Text className="text-xl font-semibold text-gray-900 text-center mb-2 mt-4">
          Error al Cargar Gasolineras
        </Text>
        <Text className="text-gray-600 text-center mb-6">{error.message}</Text>
        <TouchableOpacity
          className="bg-green-500 px-6 py-3 rounded-lg"
          onPress={() => window.location.reload()}
        >
          <Text className="text-white font-semibold">Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (filteredBySearch.length === 0) {
    return (
      <View className="flex-1 bg-slate-50">
        <View className="px-4 pt-16 pb-4">
          <View className="flex-row items-center bg-white rounded-2xl shadow-sm border border-gray-200 px-4 py-3">
            <Ionicons name="search" size={20} color="#6b7280" />
            <TextInput
              className="flex-1 ml-3 text-gray-900 text-base"
              placeholder="Buscar gasolineras en Managua..."
              placeholderTextColor="#9ca3af"
              value={searchQuery}
              onChangeText={handleSearch}
              returnKeyType="search"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity
                onPress={() => handleSearch('')}
                className="ml-2"
              >
                <Ionicons name="close-circle" size={20} color="#9ca3af" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View className="flex-1 justify-center items-center px-6">
          <Ionicons name="search-outline" size={64} color="#9ca3af" />
          <Text className="text-lg font-semibold text-gray-900 text-center mb-2 mt-4">
            {searchQuery
              ? 'No se encontraron resultados'
              : 'No hay gasolineras disponibles'}
          </Text>
          <Text className="text-gray-600 text-center">
            {searchQuery
              ? 'Intenta con otros términos de búsqueda'
              : 'Verifica tu conexión a internet y la configuración de la API'}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-slate-50">
      <View className="px-4 pt-16 pb-4">
        <View className="flex-row items-center bg-white rounded-2xl shadow-sm border border-gray-200 px-4 py-3">
          <Ionicons name="search" size={20} color="#6b7280" />
          <TextInput
            className="flex-1 ml-3 text-gray-900 text-base"
            placeholder="Buscar gasolineras en Managua..."
            placeholderTextColor="#9ca3af"
            value={searchQuery}
            onChangeText={handleSearch}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => handleSearch('')} className="ml-2">
              <Ionicons name="close-circle" size={20} color="#9ca3af" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {isLoading && (
        <View className="px-4 mb-4">
          <View className="bg-white rounded-lg p-4 shadow-sm flex-row items-center">
            <ActivityIndicator size="small" color="#22C55E" />
            <Text className="ml-3 text-gray-700">Cargando gasolineras...</Text>
          </View>
        </View>
      )}

      <FlatList
        data={filteredBySearch}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <GasStationCard station={item} />}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
