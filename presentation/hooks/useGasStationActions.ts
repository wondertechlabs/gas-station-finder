import { useCallback } from 'react';
import * as Linking from 'expo-linking';
import type { Coordinates, GasStation } from '~/domain/gasStation/models';

export type NavigationApp = 'apple' | 'google' | 'waze';

// Opciones que se muestran en los menús nativos (contexto y toolbar).
export const NAVIGATION_APPS = [
  { app: 'apple', label: 'Mapas', icon: 'map' },
  { app: 'google', label: 'Google Maps', icon: 'mappin.and.ellipse' },
  { app: 'waze', label: 'Waze', icon: 'car' },
] as const satisfies readonly {
  app: NavigationApp;
  label: string;
  icon: string;
}[];

/** Abre la ruta en coche hacia `coordinates` en la app de navegación elegida. */
export function openDirections(
  { latitude, longitude }: Coordinates,
  app: NavigationApp,
) {
  const googleUrl = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
  const urls: Record<NavigationApp, string> = {
    apple: `maps://?daddr=${latitude},${longitude}&dirflg=d`,
    google: googleUrl,
    waze: `waze://?ll=${latitude},${longitude}&navigate=yes`,
  };

  // Si Waze no está instalado, se abre Google Maps en el navegador.
  Linking.openURL(urls[app]).catch(() => {
    if (app === 'waze') Linking.openURL(googleUrl);
  });
}

export const useGasStationActions = () => {
  const handleNavigate = useCallback(
    (station: GasStation, app: NavigationApp) =>
      openDirections(station.coordinates, app),
    [],
  );

  return { handleNavigate };
};
