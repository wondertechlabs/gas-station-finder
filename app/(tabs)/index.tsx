import { useCallback } from 'react';
import { router } from 'expo-router';
import type { GasStation } from '~/domain/gasStation/models';
import { StationsMap } from '~/presentation/components/map/StationsMap';
import { ContentUnavailable } from '~/presentation/components/ui/ContentUnavailable';
import { LoadingScreen } from '~/presentation/components/ui/LoadingScreen';
import { useGasStations } from '~/presentation/hooks/useGasStations';
import { useLocation } from '~/presentation/hooks/useLocation';
import { useMapCamera } from '~/presentation/hooks/useMapCamera';

export default function GasStationMap() {
  const {
    isLoading: locationLoading,
    error: locationError,
    getCurrentLocation,
  } = useLocation();
  const { gasStations, error, refetch } = useGasStations();

  const cameraPosition = useMapCamera();

  const handleMarkerPress = useCallback((station: GasStation) => {
    router.push({
      pathname: '/gas-station-details',
      params: {
        stationId: station.id,
      },
    });
  }, []);

  if (locationLoading) {
    return <LoadingScreen message="Obteniendo ubicación..." />;
  }

  if (locationError) {
    return (
      <ContentUnavailable
        title="Ubicación no disponible"
        message={locationError}
        icon="location"
        actionLabel="Reintentar"
        onAction={getCurrentLocation}
      />
    );
  }

  if (error) {
    return (
      <ContentUnavailable
        title="No se pudieron cargar"
        message={error.message}
        icon="alert"
        actionLabel="Reintentar"
        onAction={refetch}
      />
    );
  }

  return (
    <StationsMap
      style={{ flex: 1 }}
      stations={gasStations}
      cameraPosition={cameraPosition}
      onStationPress={handleMarkerPress}
      showsUserLocation
    />
  );
}
