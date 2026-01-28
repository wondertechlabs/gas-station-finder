import { useCallback } from 'react';
import { View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { EmptyState } from '~/presentation/components/ui/EmptyState';
import { ErrorScreen } from '~/presentation/components/ui/ErrorScreen';
import { LoadingScreen } from '~/presentation/components/ui/LoadingScreen';
import { GasStationCard } from '~/presentation/components/gas-station/GasStationCard';
import { useGasStations } from '~/presentation/hooks/useGasStations';
import { useLocation } from '~/presentation/hooks/useLocation';
import { StatusBar } from 'expo-status-bar';

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
