import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function TabLayout() {
  const router = useRouter();

  const HeaderSettingsButton = () => (
    <TouchableOpacity
      onPress={() => router.push('/settings')}
      className="mr-4"
    >
      <Ionicons name="settings-outline" size={24} color="#0f172a" />
    </TouchableOpacity>
  );

  return (
    <>
      <StatusBar style="dark" backgroundColor="#ffffff" />
      <Tabs
        screenOptions={{
          headerShown: true,
          headerRight: () => <HeaderSettingsButton />,
          headerStyle: {
            backgroundColor: '#ffffff',
            shadowColor: 'transparent',
            elevation: 0,
          },
          headerTitleStyle: {
            fontWeight: '700',
            fontSize: 18,
            color: '#0f172a',
          },
          tabBarActiveTintColor: '#2563eb',
          tabBarInactiveTintColor: '#94a3b8',
          tabBarStyle: {
            backgroundColor: '#ffffff',
            borderTopWidth: 1,
            borderTopColor: '#f1f5f9',
            paddingTop: 8,
            paddingBottom: 16,
            height: 82,
            shadowColor: 'transparent',
            elevation: 0,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '600',
          },
        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Mapa',
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
        <Tabs.Screen
          name="filters"
          options={{
            title: 'Filtros',
            tabBarIcon: ({ size, color }) => (
              <Ionicons name="filter" size={size} color={color} />
            ),
          }}
        />
      </Tabs>
    </>
  );
}