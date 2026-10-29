import { useEffect } from 'react';
import {
  AccessibilityInfo,
  Animated,
  ScrollView,
  useAnimatedValue,
  View,
  type DimensionValue,
} from 'react-native';
import { colors } from '~/presentation/theme/colors';

const ROWS = 6;
// Igual que LoadingScreen: las cargas cortas no muestran nada.
const SHOW_DELAY_MS = 300;

// Silueta de la lista mientras llegan las gasolineras: mismas medidas que
// GasStationCard para que el contenido real caiga en su sitio sin saltos.
export function GasStationListSkeleton() {
  const opacity = useAnimatedValue(0);
  const pulse = useAnimatedValue(1);

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      delay: SHOW_DELAY_MS,
      duration: 200,
      useNativeDriver: true,
    }).start();

    let loop: Animated.CompositeAnimation | undefined;
    AccessibilityInfo.isReduceMotionEnabled().then((reduceMotion) => {
      if (reduceMotion) return;
      loop = Animated.loop(
        Animated.sequence([
          Animated.timing(pulse, {
            toValue: 0.5,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulse, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ]),
      );
      loop.start();
    });
    return () => loop?.stop();
  }, [opacity, pulse]);

  return (
    <ScrollView
      scrollEnabled={false}
      contentInsetAdjustmentBehavior="automatic"
      style={{ backgroundColor: colors.groupedBackground }}
      contentContainerStyle={{ padding: 16 }}
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel="Cargando gasolineras"
    >
      <Animated.View style={{ opacity }}>
        <Animated.View style={{ gap: 10, opacity: pulse }}>
          <Bar width="70%" height={13} style={{ marginHorizontal: 4 }} />
          {Array.from({ length: ROWS }, (_, index) => (
            <SkeletonCard key={index} />
          ))}
        </Animated.View>
      </Animated.View>
    </ScrollView>
  );
}

function SkeletonCard() {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingVertical: 12,
        paddingHorizontal: 14,
        borderRadius: 14,
        borderCurve: 'continuous',
        backgroundColor: colors.cellBackground,
      }}
    >
      <View
        style={{
          width: 36,
          height: 36,
          borderRadius: 18,
          backgroundColor: colors.fill,
        }}
      />
      <View style={{ flex: 1, gap: 8, paddingVertical: 3 }}>
        <Bar width="55%" height={15} />
        <Bar width="80%" height={13} />
        <Bar width="65%" height={11} />
      </View>
    </View>
  );
}

function Bar({
  width,
  height,
  style,
}: {
  width: DimensionValue;
  height: number;
  style?: { marginHorizontal: number };
}) {
  return (
    <View
      style={[
        {
          width,
          height,
          borderRadius: height / 2,
          backgroundColor: colors.fill,
        },
        style,
      ]}
    />
  );
}
