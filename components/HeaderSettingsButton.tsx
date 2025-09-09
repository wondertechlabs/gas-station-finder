import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

export const HeaderSettingsButton = () => (
  <TouchableOpacity onPress={() => router.push('/settings')} className="mr-4">
    <Ionicons name="settings-outline" size={24} color="#0f172a" />
  </TouchableOpacity>
);
