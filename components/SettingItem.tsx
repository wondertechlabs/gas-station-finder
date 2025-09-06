import { TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "react-native";

interface SettingItemProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  onPress: () => void;
}

export const SettingItem: React.FC<SettingItemProps> = ({
  icon,
  title,
  subtitle,
  onPress
}) => (
  <TouchableOpacity 
    className="flex-row items-center justify-between px-6 py-6 active:bg-slate-50/50" 
    onPress={onPress}
    style={{
      shadowColor: 'transparent',
      elevation: 0,
    }}
  >
    <View className="flex-row items-center flex-1">
      <View 
        className="w-14 h-14 rounded-3xl items-center justify-center mr-6"
        style={{
          backgroundColor: '#f8fafc',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.04,
          shadowRadius: 4,
          elevation: 1,
        }}
      >
        {icon}
      </View>
      <View className="flex-1">
        <Text className="text-lg font-bold text-slate-900 leading-6">{title}</Text>
        {subtitle && <Text className="text-sm text-slate-500 mt-1.5 leading-5 font-medium">{subtitle}</Text>}
      </View>
    </View>
    <View className="ml-3">
      <Ionicons name="chevron-forward" size={20} color="#94a3b8" />
    </View>
  </TouchableOpacity>
);
