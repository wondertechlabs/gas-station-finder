import { useEffect } from 'react';
import { AppState, Linking } from 'react-native';
import { ContentUnavailable } from '~/presentation/components/ui/ContentUnavailable';
import {
  useLocationStore,
  type LocationError,
} from '~/presentation/stores/locationStore';
import { retryWithFeedback } from '~/presentation/utils/haptics';

interface Props {
  error: LocationError;
  onRetry: () => Promise<void>;
}

// iOS no vuelve a pedir un permiso negado: se manda a Ajustes y, al volver
// a la app, se reintenta solo por si el usuario lo activó.
export function LocationUnavailable({ error, onRetry }: Props) {
  useEffect(() => {
    if (error !== 'denied') return;
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') onRetry();
    });
    return () => subscription.remove();
  }, [error, onRetry]);

  if (error === 'denied') {
    return (
      <ContentUnavailable
        title="Permite el acceso a tu ubicación"
        message="Para mostrar las gasolineras cercanas, activa la ubicación en Ajustes. También puedes buscar una ciudad en Buscar."
        icon="location"
        actionLabel="Abrir Ajustes"
        onAction={() => Linking.openSettings()}
      />
    );
  }

  return (
    <ContentUnavailable
      title="No pudimos ubicarte"
      message="Revisa que la ubicación esté activada e inténtalo de nuevo, o busca una ciudad en Buscar."
      icon="location"
      actionLabel="Reintentar"
      onAction={() =>
        retryWithFeedback(async () => {
          await onRetry();
          return useLocationStore.getState().error === null;
        })
      }
    />
  );
}
