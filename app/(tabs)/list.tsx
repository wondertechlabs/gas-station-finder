import { useCallback } from 'react';
import { View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GasStationCard } from '~/components/gas-station/GasStationCard';
import { useGasStations } from '~/hooks/useGasStations';
import { useLocation } from '~/hooks/useLocation';
import { LoadingScreen } from '~/components/ui/LoadingScreen';
import { ErrorScreen } from '~/components/ui/ErrorScreen';
import { EmptyState } from '~/components/ui/EmptyState';
import { StatusBar } from "expo-status-bar";

export default function ListTab() {
  const { isLoading: locationLoading, error: locationError } = useLocation();
  const { gasStations, error, refetch } = useGasStations();

  const handleRetry = useCallback(() => {
    refetch();
  }, [refetch]);

  if (locationLoading) {
    return <LoadingScreen message="Obteniendo ubicación..." />;
  }

  if (locationError) {
    return (
      <ErrorScreen
        title="Error de Ubicación"
        message={locationError}
        icon="location-outline"
        onRetry={handleRetry}
      />
    );
  }

  if (error) {
    return (
      <ErrorScreen
        title="Error al Cargar Gasolineras"
        message={error.message}
        onRetry={handleRetry}
      />
    );
  }

  if (gasStations.length === 0) {
    return (
      <View className="flex-1 bg-slate-50">
        <EmptyState
          title="No hay gasolineras disponibles"
          message="Verifica tu conexión a internet y la configuración de la API"
        />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1">
      <StatusBar style="dark" />
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingTop: 12, paddingBottom: 12 }}
        showsVerticalScrollIndicator={false}
      >
        {gasStations.map((station) => (
          <GasStationCard key={station.id} station={station} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
