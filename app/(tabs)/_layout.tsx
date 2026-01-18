import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { HeaderSettingsButton } from '~/components/settings/HeaderSettingsButton';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerRight: () => <HeaderSettingsButton />,
        headerStyle: {
          backgroundColor: '#ffffff',
          shadowColor: 'transparent',
        },
        tabBarActiveTintColor: '#142968',
        tabBarInactiveTintColor: '#94a3b8',
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopWidth: 1,
          borderTopColor: '#f1f5f9',
          paddingTop: 8,
          paddingBottom: 16,
          height: 82,
          shadowColor: 'transparent',
        },
        tabBarLabelStyle: {
          fontSize: 12,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Mapa',
          headerShown: false,
          tabBarIcon: ({ size, color }) => (
            <Ionicons name="map" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="list"
        options={{
          title: 'Estaciones',
          tabBarIcon: ({ size, color }) => (
            <Ionicons name="list" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
