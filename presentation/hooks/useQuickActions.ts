import { useCallback, useEffect } from 'react';
import * as QuickActions from 'expo-quick-actions';
import {
  useQuickActionRouting,
  type RouterAction,
} from 'expo-quick-actions/router';
import { useGasStations } from '~/presentation/hooks/useGasStations';
import { openDirections } from '~/presentation/hooks/useGasStationActions';
import { useLocationStore } from '~/presentation/stores/locationStore';
import { formatDistance } from '~/presentation/utils/gasStationFormat';

const NEAREST_ID = 'nearest';

const STATIC_ITEMS: RouterAction[] = [
  {
    id: 'list',
    title: 'Gasolineras cercanas',
    icon: 'symbol:list.bullet',
    params: { href: '/list' },
  },
  {
    id: 'search',
    title: 'Buscar ciudad',
    icon: 'symbol:magnifyingglass',
    params: { href: '/search' },
  },
];

/** Acciones rápidas del ícono de la app; la primera abre la ruta en Mapas. */
export function useQuickActions() {
  const handleAction = useCallback((action: QuickActions.Action) => {
    if (action.id !== NEAREST_ID) return false;
    const { latitude, longitude } = action.params ?? {};
    if (typeof latitude === 'number' && typeof longitude === 'number') {
      openDirections({ latitude, longitude }, 'apple');
    }
    return true;
  }, []);
  useQuickActionRouting(handleAction);

  const { gasStations } = useGasStations();
  // Con una ciudad elegida, "la más cercana" no sería cercana al usuario.
  const followsUser = useLocationStore((state) => !state.selectedLocation);
  const nearest = followsUser ? gasStations[0] : undefined;
  const latitude = nearest?.coordinates.latitude;
  const longitude = nearest?.coordinates.longitude;
  const subtitle =
    nearest &&
    (nearest.distance != null
      ? `${nearest.name} · ${formatDistance(nearest.distance)}`
      : nearest.name);

  useEffect(() => {
    const nearestItem: QuickActions.Action[] =
      latitude != null && longitude != null
        ? [
            {
              id: NEAREST_ID,
              title: 'Ir a la más cercana',
              subtitle,
              icon: 'symbol:fuelpump.fill',
              params: { latitude, longitude },
            },
          ]
        : [];
    QuickActions.setItems([...nearestItem, ...STATIC_ITEMS]);
  }, [latitude, longitude, subtitle]);
}
