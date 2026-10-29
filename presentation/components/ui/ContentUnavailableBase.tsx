import { Pressable, Text, View } from 'react-native';
import {
  AppIcon,
  type AppIconName,
} from '~/presentation/components/ui/AppIcon';
import { colors } from '~/presentation/theme/colors';

export interface ContentUnavailableProps {
  title: string;
  message: string;
  icon?: AppIconName;
  actionLabel?: string;
  onAction?: () => void;
}

// Versión React Native: Android e iOS < 17 (sin ContentUnavailableView).
export function ContentUnavailableBase({
  title,
  message,
  icon = 'search',
  actionLabel,
  onAction,
}: ContentUnavailableProps) {
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        padding: 24,
        backgroundColor: colors.groupedBackground,
      }}
    >
      <AppIcon name={icon} size={48} color={colors.tertiaryLabel} />
      <Text
        style={{
          fontSize: 20,
          fontWeight: '600',
          color: colors.label,
          textAlign: 'center',
        }}
      >
        {title}
      </Text>
      <Text
        selectable
        style={{
          fontSize: 15,
          color: colors.secondaryLabel,
          textAlign: 'center',
        }}
      >
        {message}
      </Text>
      {actionLabel && onAction && (
        <Pressable onPress={onAction} hitSlop={12} style={{ paddingTop: 8 }}>
          <Text style={{ fontSize: 17, fontWeight: '600', color: colors.tint }}>
            {actionLabel}
          </Text>
        </Pressable>
      )}
    </View>
  );
}
