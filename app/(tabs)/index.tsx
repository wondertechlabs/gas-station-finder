import { useCallback } from 'react';
import { View } from 'react-native';
import { router } from 'expo-router';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { GasStation } from '~/types/gasStation';
import { useGasStations } from '~/hooks/useGasStations';
import { useLocation } from '~/hooks/useLocation';
import { useMapRegion } from '~/hooks/useMapRegion';
import { LoadingScreen } from '~/components/ui/LoadingScreen';
import { ErrorScreen } from '~/components/ui/ErrorScreen';
import { GasStationMarker } from '~/components/gas-station/GasStationMarker';
import { LocationSelectorBar } from '~/components/location/LocationSelectorBar';

export default function GasStationMap() {
  const {
    userLocation,
    isLoading: locationLoading,
    error: locationError,
  } = useLocation();
  const { filteredStations, isLoading, error, refetch } = useGasStations();

  const mapRegion = useMapRegion(userLocation);

  const handleMarkerPress = useCallback(
    (station: GasStation) => {
      router.push({
        pathname: '/gas-station-details',
        params: {
          stationId: station.id,
        },
      });
    },
    [],
  );

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

  return (
    <View className="flex-1">

      <LocationSelectorBar />

      <MapView
        provider={PROVIDER_GOOGLE}
        style={{ flex: 1 }}
        region={mapRegion}
        showsUserLocation
        showsMyLocationButton
      >
        {filteredStations.map((station) => (
          <GasStationMarker
            key={station.id}
            station={station}
            onPress={handleMarkerPress}
          />
        ))}
      </MapView>
    </View>
  );
}
