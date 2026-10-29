import { useEffect, type ReactNode } from 'react';
import { Animated, useAnimatedValue } from 'react-native';

/** Las cargas cortas no muestran indicador: aparece solo pasados 300 ms. */
export const LOADING_DELAY_MS = 300;

/** Opacidad que va de 0 a 1 en 200 ms al montarse, tras `delay`. */
export function useFadeIn(delay = 0) {
  const opacity = useAnimatedValue(0);

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      delay,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [opacity, delay]);

  return opacity;
}

export function FadeIn({ children }: { children: ReactNode }) {
  const opacity = useFadeIn();
  return <Animated.View style={{ flex: 1, opacity }}>{children}</Animated.View>;
}
