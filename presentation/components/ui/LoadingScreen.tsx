import { ActivityIndicator, Text, View } from 'react-native';
import { colors } from '~/presentation/theme/colors';

interface LoadingScreenProps {
  message?: string;
}

export function LoadingScreen({ message = 'Cargando...' }: LoadingScreenProps) {
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        backgroundColor: colors.groupedBackground,
      }}
    >
      <ActivityIndicator />
      <Text style={{ fontSize: 15, color: colors.secondaryLabel }}>
        {message}
      </Text>
    </View>
  );
}
