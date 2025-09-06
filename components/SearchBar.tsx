import { View, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
}

export function SearchBar({ value, onChangeText, placeholder }: SearchBarProps) {
  return (
    <View className="px-4 pt-4 pb-3 bg-slate-50">
      <View className="flex-row items-center bg-white rounded-2xl px-4 py-4 border border-slate-200">
        <Ionicons name="search" size={20} color="#94a3b8" className="mr-3" />
        <TextInput
          className="flex-1 text-base text-slate-900 font-medium"
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#94a3b8"
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>
    </View>
  );
}