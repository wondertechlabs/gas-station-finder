import { useEffect, useState, type ReactNode } from 'react';
import { Animated, useAnimatedValue } from 'react-native';

/**
 * `true` desde que `loading` fue verdadero alguna vez. Sirve para animar el
 * contenido solo cuando reemplaza una pantalla de carga, no al cambiar de tab.
 */
export function useWasLoading(loading: boolean) {
  const [wasLoading, setWasLoading] = useState(loading);
  if (loading && !wasLoading) setWasLoading(true);
  return wasLoading;
}

/** Aparece en 200 ms al montarse si `enabled`; si no, se muestra tal cual. */
export function FadeIn({
  enabled,
  children,
}: {
  enabled: boolean;
  children: ReactNode;
}) {
  const opacity = useAnimatedValue(enabled ? 0 : 1);

  useEffect(() => {
    if (!enabled) return;
    Animated.timing(opacity, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
    // Solo al montarse: el contenido ya visible no vuelve a animarse.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <Animated.View style={{ flex: 1, opacity }}>{children}</Animated.View>;
}
