import { router, Stack } from 'expo-router';
import { ContentUnavailable } from '~/presentation/components/ui/ContentUnavailable';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Title>No encontrada</Stack.Title>
      <ContentUnavailable
        title="Esta pantalla no existe"
        icon="alert"
        actionLabel="Ir al mapa"
        onAction={() => router.replace('/')}
      />
    </>
  );
}
