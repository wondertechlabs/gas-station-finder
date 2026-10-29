import { Host } from '@expo/ui';
import { Button, ContentUnavailableView } from '@expo/ui/swift-ui';
import { Platform } from 'react-native';
import { APP_ICONS } from '~/presentation/components/ui/AppIcon';
import {
  ContentUnavailableBase,
  type ContentUnavailableProps,
} from '~/presentation/components/ui/ContentUnavailableBase';
import { colors } from '~/presentation/theme/colors';

// ContentUnavailableView de SwiftUI solo existe desde iOS 17; el mínimo de la app es 16.4.
const supportsNativeView = parseInt(String(Platform.Version), 10) >= 17;

export function ContentUnavailable(props: ContentUnavailableProps) {
  if (!supportsNativeView) return <ContentUnavailableBase {...props} />;

  const { title, message, icon = 'search', actionLabel, onAction } = props;

  return (
    <Host style={{ flex: 1, backgroundColor: colors.groupedBackground }}>
      <ContentUnavailableView
        title={title}
        description={message}
        systemImage={APP_ICONS[icon].ios}
        actions={
          actionLabel && onAction ? (
            <Button label={actionLabel} onPress={onAction} />
          ) : undefined
        }
      />
    </Host>
  );
}
