import { ActivityIndicator, Animated, View } from 'react-native';
import {
  LOADING_DELAY_MS,
  useFadeIn,
} from '~/presentation/components/ui/FadeIn';
import { colors } from '~/presentation/theme/colors';

interface LoadingScreenProps {
  message?: string;
}

export function LoadingScreen({ message = 'Cargando…' }: LoadingScreenProps) {
  const opacity = useFadeIn(LOADING_DELAY_MS);

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
