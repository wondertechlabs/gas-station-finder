import { Ionicons } from '@expo/vector-icons';
import { View } from 'react-native';
import { COLORS } from '~/config/constants';

export default function SearchIndex() {
  return <View className="flex-1 bg-gray-50 items-center justify-center px-4">
    <View className="items-center">
      <View
        className="w-16 h-16 rounded-full items-center justify-center mb-4"
        style={{
          backgroundColor: COLORS.PRIMARY + '20',
        }}
      >
        <Ionicons
          name="location"
          size={32}
          color={COLORS.PRIMARY}
        />
      </View>
    </View>
  </View>;
}
