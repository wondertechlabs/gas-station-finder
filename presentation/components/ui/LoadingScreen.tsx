import { useEffect } from 'react';
import {
  ActivityIndicator,
  Animated,
  useAnimatedValue,
  View,
} from 'react-native';
import { colors } from '~/presentation/theme/colors';

interface LoadingScreenProps {
  message?: string;
}

// Las cargas cortas no muestran nada: el spinner aparece solo si la espera
// pasa de 300 ms, para no destellar en cada arranque con caché.
const SHOW_DELAY_MS = 300;

export function LoadingScreen({ message = 'Cargando…' }: LoadingScreenProps) {
  const opacity = useAnimatedValue(0);

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      delay: SHOW_DELAY_MS,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [opacity]);

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.groupedBackground,
      }}
    >
      <Animated.View style={{ alignItems: 'center', gap: 12, opacity }}>
        <ActivityIndicator />
        <Animated.Text style={{ fontSize: 15, color: colors.secondaryLabel }}>
          {message}
        </Animated.Text>
      </Animated.View>
    </View>
  );
}
