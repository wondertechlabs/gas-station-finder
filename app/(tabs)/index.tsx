import { useCallback } from 'react';
import { View } from 'react-native';
import { router } from 'expo-router';
import MapView from 'react-native-maps';
import type { GasStation } from '~/domain/gasStation/models';
import { GasStationMarker } from '~/presentation/components/gas-station/GasStationMarker';
import { ErrorScreen } from '~/presentation/components/ui/ErrorScreen';
import { LoadingScreen } from '~/presentation/components/ui/LoadingScreen';
import { useGasStations } from '~/presentation/hooks/useGasStations';
import { useLocation } from '~/presentation/hooks/useLocation';
import { useMapRegion } from '~/presentation/hooks/useMapRegion';

export default function GasStationMap() {
  const {
    userLocation,
    isLoading: locationLoading,
    error: locationError,
  } = useLocation();
  const { filteredStations, error, refetch } = useGasStations();

  const mapRegion = useMapRegion(userLocation);

  const handleMarkerPress = useCallback((station: GasStation) => {
    router.push({
      pathname: '/gas-station-details',
      params: {
        stationId: station.id,
      },
    });
  }, []);

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
      <MapView
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
