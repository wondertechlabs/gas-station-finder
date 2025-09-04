import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/colors';

export default function TabLayout() {
  const router = useRouter();

  const HeaderSettingsButton = () => (
    <TouchableOpacity
      onPress={() => router.push('/settings')}
      style={{ marginRight: 16 }}
    >
      <Ionicons name="settings-outline" size={24} color={Colors.text} />
    </TouchableOpacity>
  );

  return (
    <>
      <StatusBar style="dark" backgroundColor={Colors.background} />
      <Tabs
        screenOptions={{
          headerShown: true,
          headerRight: () => <HeaderSettingsButton />,
          headerStyle: {
            backgroundColor: Colors.background,
            shadowColor: 'transparent',
            elevation: 0,
          },
          headerTitleStyle: {
            fontWeight: '700',
            fontSize: 18,
            color: Colors.text,
          },
          tabBarActiveTintColor: Colors.primary,
          tabBarInactiveTintColor: Colors.gray400,
          tabBarStyle: {
            backgroundColor: Colors.background,
            borderTopWidth: 1,
            borderTopColor: Colors.gray100,
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
        <Tabs.Screen
          name="settings"
          options={{
            title: 'Ajustes',
            tabBarIcon: ({ size, color }) => (
              <Ionicons name="settings" size={size} color={color} />
            ),
          }}
        />
      </Tabs>
    </>
  );
}