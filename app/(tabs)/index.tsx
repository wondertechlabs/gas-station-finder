import { useCallback } from 'react';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import type { GasStation } from '~/domain/gasStation/models';
import { GasStationsError } from '~/presentation/components/gas-station/GasStationsError';
import { MapLoadingPill } from '~/presentation/components/map/MapLoadingPill';
import { StationsMap } from '~/presentation/components/map/StationsMap';
import { LocationUnavailable } from '~/presentation/components/location/LocationUnavailable';
import { FadeIn } from '~/presentation/components/ui/FadeIn';
import { LoadingScreen } from '~/presentation/components/ui/LoadingScreen';
import { useGasStations } from '~/presentation/hooks/useGasStations';
import { useLocation } from '~/presentation/hooks/useLocation';
import { useMapCamera } from '~/presentation/hooks/useMapCamera';

export default function GasStationMap() {
  const { isLoading: locationLoading, error: locationError } = useLocation();
  const { gasStations, isLoading, isShowingPrevious, error, refetch } =
    useGasStations();

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
    return <LoadingScreen message="Buscando tu ubicación…" />;
  }

  if (locationError) {
    return <LocationUnavailable error={locationError} />;
  }

  if (error) {
    return <GasStationsError onRetry={refetch} />;
  }

  return (
    <FadeIn>
      <StationsMap
        style={{ flex: 1 }}
        stations={gasStations}
        cameraPosition={cameraPosition}
        onStationPress={handleMarkerPress}
        showsUserLocation
      />
      <MapLoadingPill visible={isLoading || isShowingPrevious} />
    </FadeIn>
  );
}
