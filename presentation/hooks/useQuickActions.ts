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

/**
 * Acciones rápidas del ícono de la app (mantener presionado en la pantalla de
 * inicio). La primera abre la ruta a la gasolinera más cercana sin pasar por
 * la app; se actualiza cada vez que cambia la lista.
 */
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

  useEffect(() => {
    const items: (QuickActions.Action | RouterAction)[] = [];

    if (nearest) {
      items.push({
        id: NEAREST_ID,
        title: 'Ir a la más cercana',
        subtitle:
          nearest.distance != null
            ? `${nearest.name} · ${formatDistance(nearest.distance)}`
            : nearest.name,
        icon: 'symbol:fuelpump.fill',
        params: {
          latitude: nearest.coordinates.latitude,
          longitude: nearest.coordinates.longitude,
        },
      });
    }
    items.push(
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
    );
    QuickActions.setItems(items);
  }, [nearest]);
}
