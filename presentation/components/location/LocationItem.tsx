import { memo } from 'react';
import { Pressable, Text, View, type ColorValue } from 'react-native';
import type { LocationResult } from '~/domain/location/models';
import {
  AppIcon,
  type AppIconName,
} from '~/presentation/components/ui/AppIcon';
import { colors } from '~/presentation/theme/colors';

interface LocationItemProps {
  location: LocationResult;
  onPress: () => void;
  iconColor?: ColorValue;
  iconName?: AppIconName;
  /** Última fila de la sección: sin separador inferior. */
  last?: boolean;
}

export const LocationItem = memo<LocationItemProps>(
  ({
    location,
    onPress,
    iconColor = colors.tint,
    iconName = 'location',
    last,
  }) => (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingLeft: 16,
        backgroundColor: pressed ? colors.cellHighlight : 'transparent',
      })}
    >
      <AppIcon name={iconName} size={20} color={iconColor} />
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 8,
          paddingVertical: 11,
          paddingRight: 16,
          borderBottomWidth: last ? 0 : 0.5,
          borderBottomColor: colors.separator,
        }}
      >
        <View style={{ flex: 1, gap: 2 }}>
          <Text style={{ fontSize: 17, color: colors.label }} numberOfLines={1}>
            {location.name}
          </Text>
          <Text
            style={{ fontSize: 15, color: colors.secondaryLabel }}
            numberOfLines={1}
          >
            {location.address}
          </Text>
        </View>
        <AppIcon name="chevronRight" size={13} color={colors.tertiaryLabel} />
      </View>
    </Pressable>
  ),
);

LocationItem.displayName = 'LocationItem';
