import { useCallback } from 'react';
import * as Linking from 'expo-linking';
import { GasStation } from '~/types/gasStation';

export const useGasStationActions = () => {
  const handleNavigate = useCallback((station: GasStation) => {
    const { latitude, longitude } = station.coordinates;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
    Linking.openURL(url);
  }, []);

  const handleCall = useCallback((phone: string) => {
    const url = `tel:${phone}`;
    Linking.openURL(url);
  }, []);

  return {
    handleNavigate,
    handleCall,
  };
};
