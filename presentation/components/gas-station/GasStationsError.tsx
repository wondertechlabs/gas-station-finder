import { ContentUnavailable } from '~/presentation/components/ui/ContentUnavailable';
import { retryWithFeedback } from '~/presentation/utils/haptics';

export function GasStationsError({
  onRetry,
}: {
  onRetry: () => Promise<{ status: string }>;
}) {
  return (
    <ContentUnavailable
      title="No se pudieron cargar las gasolineras"
      icon="alert"
      actionLabel="Reintentar"
      onAction={() =>
        retryWithFeedback(async () => (await onRetry()).status === 'success')
      }
    />
  );
}
