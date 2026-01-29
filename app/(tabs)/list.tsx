import { FlatList, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { GasStationCard } from '~/presentation/components/gas-station/GasStationCard';
import { EmptyState } from '~/presentation/components/ui/EmptyState';
import { LoadingScreen } from '~/presentation/components/ui/LoadingScreen';
import { useGasStations } from '~/presentation/hooks/useGasStations';
import { useLocation } from '~/presentation/hooks/useLocation';
import type { GasStation } from '~/domain/gasStation/models';

export default function ListTab() {
  const { isLoading } = useLocation();
  const { gasStations } = useGasStations();

  if (isLoading) {
    return <LoadingScreen message="Obteniendo ubicación..." />;
  }

  if (gasStations.length === 0) {
    return (
      <View className="flex-1 bg-gray-100">
        <EmptyState
          title="No hay gasolineras"
          message="No encontramos gasolineras cercanas"
        />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <StatusBar style="dark" />
      <FlatList
        data={gasStations}
        keyExtractor={(item: GasStation) => item.id}
        renderItem={({ item }) => <GasStationCard station={item} />}
        contentContainerStyle={{ paddingVertical: 16, paddingHorizontal: 12 }}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}
