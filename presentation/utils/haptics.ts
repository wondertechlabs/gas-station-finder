import * as Haptics from 'expo-haptics';

/** Confirma el resultado de un reintento que pidió el usuario. */
export async function retryWithFeedback(retry: () => Promise<boolean>) {
  const ok = await retry();
  Haptics.notificationAsync(
    ok
      ? Haptics.NotificationFeedbackType.Success
      : Haptics.NotificationFeedbackType.Error,
  );
}
