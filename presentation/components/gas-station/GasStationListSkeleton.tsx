import { useEffect } from 'react';
import {
  AccessibilityInfo,
  Animated,
  ScrollView,
  useAnimatedValue,
  View,
  type DimensionValue,
} from 'react-native';
import {
  cardStyle,
  iconCircleStyle,
} from '~/presentation/components/gas-station/GasStationCard';
import {
  LOADING_DELAY_MS,
  useFadeIn,
} from '~/presentation/components/ui/FadeIn';
import { colors } from '~/presentation/theme/colors';

const ROWS = 6;

// Silueta de la lista mientras llegan las gasolineras.
export function GasStationListSkeleton() {
  const opacity = useFadeIn(LOADING_DELAY_MS);
  const pulse = useAnimatedValue(1);

  useEffect(() => {
    let loop: Animated.CompositeAnimation | undefined;
    AccessibilityInfo.isReduceMotionEnabled().then((reduceMotion) => {
      if (reduceMotion) return;
      const step = (toValue: number) =>
        Animated.timing(pulse, {
          toValue,
          duration: 800,
          useNativeDriver: true,
        });
      loop = Animated.sequence([
        Animated.delay(LOADING_DELAY_MS),
        Animated.loop(Animated.sequence([step(0.5), step(1)])),
      ]);
      loop.start();
    });
    return () => loop?.stop();
  }, [pulse]);

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
          <View style={{ paddingHorizontal: 4 }}>
            <Bar width="70%" height={13} />
          </View>
          {Array.from({ length: ROWS }, (_, index) => (
            <View
              key={index}
              style={[cardStyle, { backgroundColor: colors.cellBackground }]}
            >
              <View style={iconCircleStyle} />
              <View style={{ flex: 1, gap: 8, paddingVertical: 3 }}>
                <Bar width="55%" height={15} />
                <Bar width="80%" height={13} />
                <Bar width="65%" height={11} />
              </View>
            </View>
          ))}
        </Animated.View>
      </Animated.View>
    </ScrollView>
  );
}

function Bar({ width, height }: { width: DimensionValue; height: number }) {
  return (
    <View
      style={{
        width,
        height,
        borderRadius: height / 2,
        backgroundColor: colors.fill,
      }}
    />
  );
}
