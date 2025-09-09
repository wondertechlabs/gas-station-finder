import { useCallback } from 'react';
import * as Linking from 'expo-linking';
import { GasStation } from '~/types/gasStation';

export const useGasStationActions = () => {
  const handleNavigate = useCallback(
    (station: GasStation, app: 'google' | 'waze') => {
      const { latitude, longitude } = station.coordinates;

      let url: string;

      if (app === 'waze') {
        // Waze URL scheme
        url = `waze://?ll=${latitude},${longitude}&navigate=yes`;
      } else {
        // Google Maps URL
        url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
      }

      Linking.openURL(url).catch(() => {
        // Fallback to Google Maps if Waze is not installed
        if (app === 'waze') {
          const fallbackUrl = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
          Linking.openURL(fallbackUrl);
        }
      });
    },
    [],
  );

  const handleCall = useCallback((phone: string) => {
    const url = `tel:${phone}`;
    Linking.openURL(url);
  }, []);

  return {
    handleNavigate,
    handleCall,
  };
};
