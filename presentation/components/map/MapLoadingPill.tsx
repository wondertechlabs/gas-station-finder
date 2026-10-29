import { useEffect } from 'react';
import {
  ActivityIndicator,
  Animated,
  Text,
  useAnimatedValue,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '~/presentation/theme/colors';

// Aviso flotante sobre el mapa mientras llegan las gasolineras: el mapa
// sigue usable y el aviso se desvanece al terminar.
export function MapLoadingPill({ visible }: { visible: boolean }) {
  const insets = useSafeAreaInsets();
  const opacity = useAnimatedValue(0);

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: visible ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [visible, opacity]);

  return (
    <Animated.View
      pointerEvents="none"
      accessibilityLiveRegion="polite"
      accessibilityElementsHidden={!visible}
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
