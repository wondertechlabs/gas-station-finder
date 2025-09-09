import { useCallback } from 'react';
import { View } from 'react-native';
import { StatusBar } from "expo-status-bar";
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { GasStation } from '~/types/gasStation';
import { useGasStationStore } from '~/stores/gasStationStore';
import { useGasStations } from '~/hooks/useGasStations';
import { useLocation } from '~/hooks/useLocation';
import { useMapRegion } from '~/hooks/useMapRegion';
import { useGasStationActions } from '~/hooks/useGasStationActions';
import { LoadingScreen } from '~/components/LoadingScreen';
import { ErrorScreen } from '~/components/ErrorScreen';
import { LoadingOverlay } from '~/components/LoadingOverlay';
import { GasStationMarker } from '~/components/GasStationMarker';
import { GasStationDetails } from '~/components/GasStationDetails';
import { LocationSelectorBar } from '~/components/LocationSelectorBar';

export default function GasStationMap() {
  const { selectedStation, setSelectedStation, clearSelection } =
    useGasStationStore();
  const {
    userLocation,
    isLoading: locationLoading,
    error: locationError,
  } = useLocation();
  const { filteredStations, isLoading, error, refetch } = useGasStations();
  const { handleNavigate, handleCall } = useGasStationActions();

  const mapRegion = useMapRegion(userLocation);

  const handleMarkerPress = useCallback(
    (station: GasStation) => {
      setSelectedStation(station);
    },
    [setSelectedStation],
  );

  const handleMapPress = useCallback(() => {
    clearSelection();
  }, [clearSelection]);

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
      <StatusBar style="dark" />
      
      <LocationSelectorBar />
      
      <MapView
        provider={PROVIDER_GOOGLE}
        style={{ flex: 1 }}
        region={mapRegion}
        onPress={handleMapPress}
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

      <LoadingOverlay visible={isLoading} message="Cargando gasolineras..." />

      {selectedStation && (
        <GasStationDetails
          station={selectedStation}
          onClose={clearSelection}
          onNavigate={handleNavigate}
          onCall={handleCall}
        />
      )}
    </View>
  );
}
