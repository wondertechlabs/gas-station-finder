import React from 'react';
import { Marker } from 'react-native-maps';
import { GasStation } from '~/types/gasStation';

interface GasStationMarkerProps {
  station: GasStation;
  onPress: (station: GasStation) => void;
}

export const GasStationMarker = React.memo<GasStationMarkerProps>(
  ({ station, onPress }) => (
    <Marker
      key={station.id}
      coordinate={station.coordinates}
      title={station.name}
      description={station.brand}
      onPress={() => onPress(station)}
    />
  ),
);
