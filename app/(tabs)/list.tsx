import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GasStationCard } from '~/components/GasStationCard';
import { useGasStations } from '~/hooks/useGasStations';
import { useLocation } from '~/hooks/useLocation';

export default function ListTab() {
  const { isLoading: locationLoading, error: locationError } = useLocation();
  const { gasStations, isLoading, error } = useGasStations();

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

  if (gasStations.length === 0) {
    return (
      <View className="flex-1 bg-slate-50">
        <View className="flex-1 justify-center items-center px-6">
          <Ionicons name="search-outline" size={64} color="#9ca3af" />
          <Text className="text-lg font-semibold text-gray-900 text-center mb-2 mt-4">
            No hay gasolineras disponibles
          </Text>
          <Text className="text-gray-600 text-center">
            Verifica tu conexión a internet y la configuración de la API
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-slate-50">
      {isLoading && (
        <View className="px-4 pt-13 pb-4">
          <View className="bg-white rounded-lg p-4 shadow-sm flex-row items-center">
            <ActivityIndicator size="small" color="#22C55E" />
            <Text className="ml-3 text-gray-700">Cargando gasolineras...</Text>
          </View>
        </View>
      )}

      <FlatList
        data={gasStations}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <GasStationCard station={item} />}
        contentContainerStyle={{
          paddingTop: 12,
          paddingBottom: 12,
        }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
