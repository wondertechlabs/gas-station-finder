import { SymbolView } from 'expo-symbols';
import type { ColorValue, StyleProp, ViewStyle } from 'react-native';

// SF Symbols en iOS, Material Symbols en Android: una familia por plataforma.
export const APP_ICONS = {
  alert: { ios: 'exclamationmark.circle', android: 'error' },
  car: { ios: 'car.fill', android: 'directions_car' },
  chevronRight: { ios: 'chevron.right', android: 'chevron_right' },
  directions: {
    ios: 'arrow.triangle.turn.up.right.diamond.fill',
    android: 'directions',
  },
  fuel: { ios: 'fuelpump.fill', android: 'local_gas_station' },
  distance: { ios: 'location.north.line.fill', android: 'near_me' },
  location: { ios: 'location.fill', android: 'location_on' },
  map: { ios: 'map.fill', android: 'map' },
  pin: { ios: 'mappin.and.ellipse', android: 'pin_drop' },
  search: { ios: 'magnifyingglass', android: 'search' },
  star: { ios: 'star.fill', android: 'star' },
} as const;

export type AppIconName = keyof typeof APP_ICONS;

interface AppIconProps {
  name: AppIconName;
  size?: number;
  color?: ColorValue;
  style?: StyleProp<ViewStyle>;
}

export function AppIcon({ name, size = 20, color, style }: AppIconProps) {
  return (
    <SymbolView
      name={APP_ICONS[name]}
      size={size}
      tintColor={color}
      resizeMode="scaleAspectFit"
      style={style}
    />
  );
}
