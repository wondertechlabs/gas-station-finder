import { View, FlatList } from 'react-native';
import { GasStationCard } from '~/components/GasStationCard';
import { useGasStations } from '~/hooks/useGasStations';
import { useLocation } from '~/hooks/useLocation';
import { LoadingScreen } from '~/components/LoadingScreen';
import { ErrorScreen } from '~/components/ErrorScreen';
import { EmptyState } from '~/components/EmptyState';
import { LoadingOverlay } from '~/components/LoadingOverlay';

export default function ListTab() {
  const { isLoading: locationLoading, error: locationError } = useLocation();
  const { gasStations, isLoading, error, refetch } = useGasStations();

  const handleRetry = () => {
    refetch();
  };

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
      <LoadingOverlay visible={isLoading} message="Cargando gasolineras..." />

      <FlatList
        data={gasStations}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <GasStationCard station={item} />}
        contentContainerStyle={{
          paddingTop: 12,
          paddingBottom: 12,
        }}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews
        maxToRenderPerBatch={10}
        windowSize={10}
        initialNumToRender={10}
      />
    </View>
  );
}
