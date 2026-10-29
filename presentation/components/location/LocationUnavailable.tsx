import { Linking } from 'react-native';
import { ContentUnavailable } from '~/presentation/components/ui/ContentUnavailable';
import {
  useLocationStore,
  type LocationError,
} from '~/presentation/stores/locationStore';
import { retryWithFeedback } from '~/presentation/utils/haptics';

export function LocationUnavailable({ error }: { error: LocationError }) {
  const getCurrentLocation = useLocationStore(
    (state) => state.getCurrentLocation,
  );

  if (error === 'denied') {
    return (
      <ContentUnavailable
        title="Ubicación desactivada"
        message="Actívala para ver gasolineras cercanas."
        icon="location"
        actionLabel="Abrir Ajustes"
        onAction={() => Linking.openSettings()}
      />
    );
  }

  return (
    <ContentUnavailable
      title="No pudimos ubicarte"
      icon="location"
      actionLabel="Reintentar"
      onAction={() =>
        retryWithFeedback(async () => {
          await getCurrentLocation();
          return useLocationStore.getState().error === null;
        })
      }
    />
  );
}
