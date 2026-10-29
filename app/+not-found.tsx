import { router, Stack } from 'expo-router';
import { ContentUnavailable } from '~/presentation/components/ui/ContentUnavailable';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Title>No encontrada</Stack.Title>
      <ContentUnavailable
        title="Esta pantalla no existe"
        message="Puede que el enlace esté roto o desactualizado."
        icon="alert"
        actionLabel="Ir al mapa"
        onAction={() => router.replace('/')}
      />
    </>
  );
}
