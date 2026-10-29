import { useCallback } from 'react';
import { View } from 'react-native';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import type { GasStation } from '~/domain/gasStation/models';
import { MapLoadingPill } from '~/presentation/components/map/MapLoadingPill';
import { StationsMap } from '~/presentation/components/map/StationsMap';
import { LocationUnavailable } from '~/presentation/components/location/LocationUnavailable';
import { ContentUnavailable } from '~/presentation/components/ui/ContentUnavailable';
import { FadeIn, useWasLoading } from '~/presentation/components/ui/FadeIn';
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
  const { gasStations, isLoading, isShowingPrevious, error, retry } =
    useGasStations();
  const fadeIn = useWasLoading(locationLoading);

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
        onAction={retry}
      />
    );
  }

  return (
    <FadeIn enabled={fadeIn}>
      <View style={{ flex: 1 }}>
        <StationsMap
          style={{ flex: 1 }}
          stations={gasStations}
          cameraPosition={cameraPosition}
          onStationPress={handleMarkerPress}
          showsUserLocation
        />
        <MapLoadingPill visible={isLoading || isShowingPrevious} />
      </View>
    </FadeIn>
  );
}
