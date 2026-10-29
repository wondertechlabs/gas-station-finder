import { useMemo } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';
import { AppleMaps, GoogleMaps, type CameraPosition } from 'expo-maps';
import type { GasStation } from '~/domain/gasStation/models';
import { COLORS } from '~/shared/constants';

interface StationsMapProps {
  stations: GasStation[];
  cameraPosition: CameraPosition;
  onStationPress?: (station: GasStation) => void;
  showsUserLocation?: boolean;
  /** `false` para mapas de vista previa que no deben moverse. */
  interactive?: boolean;
  style?: StyleProp<ViewStyle>;
}

// Apple Maps en iOS y Google Maps en Android (expo-maps no soporta Google en iOS).
export function StationsMap({
  stations,
  cameraPosition,
  onStationPress,
  showsUserLocation = false,
  interactive = true,
  style,
}: StationsMapProps) {
  const handleMarkerClick = (marker: { id?: string }) => {
    const station = stations.find((s) => s.id === marker.id);
    if (station) onStationPress?.(station);
  };

  const appleMarkers = useMemo<AppleMaps.Marker[]>(
    () =>
      stations.map((station) => ({
        id: station.id,
        coordinates: station.coordinates,
        title: station.name,
        systemImage: 'fuelpump.fill',
        tintColor: COLORS.PRIMARY,
      })),
    [stations],
  );

  const googleMarkers = useMemo<GoogleMaps.Marker[]>(
    () =>
      stations.map((station) => ({
        id: station.id,
        coordinates: station.coordinates,
        title: station.name,
        snippet: station.address,
      })),
    [stations],
  );

  const map =
    process.env.EXPO_OS === 'ios' ? (
      <AppleMaps.View
        style={{ flex: 1 }}
        cameraPosition={cameraPosition}
        markers={appleMarkers}
        onMarkerClick={handleMarkerClick}
        properties={{
          isMyLocationEnabled: showsUserLocation,
          // Solo las gasolineras son tocables: sin POIs de Apple ni selección libre.
          pointsOfInterest: { including: [] },
          selectionEnabled: false,
        }}
        uiSettings={{ myLocationButtonEnabled: showsUserLocation }}
      />
    ) : (
      <GoogleMaps.View
        style={{ flex: 1 }}
        cameraPosition={cameraPosition}
        markers={googleMarkers}
        onMarkerClick={handleMarkerClick}
        properties={{ isMyLocationEnabled: showsUserLocation }}
        uiSettings={{
          myLocationButtonEnabled: showsUserLocation,
          scrollGesturesEnabled: interactive,
          zoomGesturesEnabled: interactive,
          rotationGesturesEnabled: interactive,
          tiltGesturesEnabled: interactive,
          mapToolbarEnabled: false,
        }}
      />
    );

  // Apple Maps no permite desactivar gestos, así que bloqueamos los toques.
  return (
    <View style={style} pointerEvents={interactive ? 'auto' : 'none'}>
      {map}
    </View>
  );
}
