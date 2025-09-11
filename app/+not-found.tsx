import { Link, Stack } from 'expo-router';
import { Text, View } from 'react-native';
import { StatusBar } from "expo-status-bar";

export default function NotFoundScreen() {
  return (
    <View className="flex-1 justify-center items-center">
      <StatusBar style="dark" />
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View className="flex-1 justify-center items-center">
        <Text className="text-4xl font-bold text-slate-900">404</Text>
        <Text className="text-base text-slate-900">
          Esta pantalla no existe.
        </Text>
        <Text className="text-base text-slate-600">
          La página que buscas no se encuentra disponible
        </Text>

        <View className="flex-row items-center justify-center">
          <Link href="/" className="text-base text-slate-600">
            <Text className="text-base text-slate-600">Ir al inicio</Text>
          </Link>
        </View>
      </View>
    </View>
  );
}
