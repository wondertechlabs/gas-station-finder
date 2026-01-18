import { useCallback, useMemo } from 'react';
import { View, FlatList } from 'react-native';
import { GasStationCard } from '~/components/gas-station/GasStationCard';
import { useGasStations } from '~/hooks/useGasStations';
import { useLocation } from '~/hooks/useLocation';
import { LoadingScreen } from '~/components/ui/LoadingScreen';
import { ErrorScreen } from '~/components/ui/ErrorScreen';
import { EmptyState } from '~/components/ui/EmptyState';
import { LoadingOverlay } from '~/components/ui/LoadingOverlay';
import { StatusBar } from "expo-status-bar";

export default function ListTab() {
  const { isLoading: locationLoading, error: locationError } = useLocation();
  const { gasStations, isLoading, error, refetch } = useGasStations();

  const handleRetry = useCallback(() => {
    refetch();
  }, [refetch]);

  const renderItem = useCallback(({ item }: { item: typeof gasStations[0] }) => (
    <GasStationCard station={item} />
  ), []);

  const keyExtractor = useCallback((item: typeof gasStations[0]) => item.id, []);

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
    <View className="flex-1 bg-slate-50">
      <StatusBar style="dark" />
      <LoadingOverlay visible={isLoading} message="Cargando gasolineras..." />

      <FlatList
        data={gasStations}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        contentContainerStyle={{
          paddingTop: 12,
          paddingBottom: 12,
        }}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews
        maxToRenderPerBatch={10}
        windowSize={10}
        initialNumToRender={10}
        getItemLayout={(_, index) => ({
          length: 200, // Approximate item height
          offset: 200 * index,
          index,
        })}
      />
    </View>
  );
}
