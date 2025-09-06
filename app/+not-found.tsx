import { Link, Stack } from 'expo-router';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function NotFoundScreen() {
  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View className="flex-1 justify-center items-center">
        <Text className="text-4xl font-bold text-slate-900">404</Text>
        <Text className="text-base text-slate-900">Esta pantalla no existe.</Text>
        <Text className="text-base text-slate-600">
          La página que buscas no se encuentra disponible
        </Text>
        
        <View className="flex-row items-center justify-center">
          <Link href="/" className="text-base text-slate-600">
            <Text className="text-base text-slate-600">Ir al inicio</Text>
          </Link>
        </View>
      </View>
    </SafeAreaView>
  );
}