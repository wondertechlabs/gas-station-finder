import { ActivityIndicator, Animated, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFadeIn } from '~/presentation/components/ui/FadeIn';
import { colors } from '~/presentation/theme/colors';

// Aviso flotante sobre el mapa mientras llegan las gasolineras.
export function MapLoadingPill({ visible }: { visible: boolean }) {
  return visible ? <Pill /> : null;
}

function Pill() {
  const insets = useSafeAreaInsets();
  const opacity = useFadeIn();

  return (
    <Animated.View
      pointerEvents="none"
      accessibilityLiveRegion="polite"
      style={{
        position: 'absolute',
        top: insets.top + 8,
        alignSelf: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingVertical: 8,
        paddingHorizontal: 14,
        borderRadius: 999,
        borderCurve: 'continuous',
        backgroundColor: colors.cellBackground,
        boxShadow: '0 2px 12px rgba(0, 0, 0, 0.15)',
        opacity,
      }}
    >
      <ActivityIndicator size="small" />
      <Text style={{ fontSize: 15, color: colors.secondaryLabel }}>
        Buscando gasolineras…
      </Text>
    </Animated.View>
  );
}
