import { useCallback } from 'react';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import type { GasStation } from '~/domain/gasStation/models';
import { StationsMap } from '~/presentation/components/map/StationsMap';
import { LocationUnavailable } from '~/presentation/components/location/LocationUnavailable';
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
    Haptics.selectionAsync();
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
      <LocationUnavailable error={locationError} onRetry={getCurrentLocation} />
    );
  }

  if (error) {
    return (
      <ContentUnavailable
        title="No se pudieron cargar las gasolineras"
        message="Revisa tu conexión a internet e inténtalo de nuevo."
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
