import React, { useCallback } from 'react';
import { Marker } from 'react-native-maps';
import type { GasStation } from '~/domain/gasStation/models';

interface GasStationMarkerProps {
  station: GasStation;
  onPress: (station: GasStation) => void;
}

export const GasStationMarker = React.memo<GasStationMarkerProps>(
  ({ station, onPress }) => {
    const handlePress = useCallback(() => {
      onPress(station);
    }, [station, onPress]);

    return (
      <Marker
        coordinate={station.coordinates}
        title={station.name}
        description={station.brand}
        onPress={handlePress}
      />
    );
  },
  (prevProps, nextProps) => prevProps.station.id === nextProps.station.id,
);
