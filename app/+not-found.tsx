import { router, Stack } from 'expo-router';
import { ContentUnavailable } from '~/presentation/components/ui/ContentUnavailable';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Title>No encontrada</Stack.Title>
      <ContentUnavailable
        title="Esta pantalla no existe"
        message="La página que buscas no se encuentra disponible"
        icon="alert"
        actionLabel="Ir al inicio"
        onAction={() => router.replace('/')}
      />
    </>
  );
}
