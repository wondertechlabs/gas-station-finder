import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';


export default function MapTab() {
  return (
    <SafeAreaView className="flex-1 bg-slate-50 pt-0">
      <ScrollView className="flex-1">
        <View className="flex-1 justify-center items-center p-8 m-4 mt-2 rounded-2xl bg-white border border-slate-200">
          <View className="mb-6 p-5 bg-slate-50 rounded-3xl">
            <Ionicons name="map" size={64} color="#2563eb" />
          </View>
          <Text className="text-3xl font-bold text-slate-900 mb-3 text-center">Mapa Interactivo</Text>
          <Text className="text-base text-slate-600 text-center leading-6 mb-6 max-w-[280px]">
            El mapa estará disponible próximamente con todas las estaciones de servicio de Managua
          </Text>
          
          <View className="bg-emerald-500 px-5 py-2.5 rounded-2xl">
            <Text className="text-sm font-semibold text-white">Próximamente</Text>
          </View>
        </View>

        <View className="bg-white m-4 mt-0 rounded-2xl border border-slate-200">
          <View className="p-6 pb-4 border-b border-slate-100">
            <Text className="text-xl font-bold text-slate-900 text-center">Características del Mapa</Text>
          </View>
          
          <View className="p-6 pt-5 gap-4">
            <View className="flex-row items-center gap-4">
              <View className="w-2.5 h-2.5 rounded-full bg-green-500" />
              <Text className="text-base text-slate-900 leading-6 font-medium">Ubicación en tiempo real</Text>
            </View>
            <View className="flex-row items-center gap-4">
              <View className="w-2.5 h-2.5 rounded-full bg-cyan-500" />
              <Text className="text-base text-slate-900 leading-6 font-medium">Estaciones cercanas</Text>
            </View>
            <View className="flex-row items-center gap-4">
              <View className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <Text className="text-base text-slate-900 leading-6 font-medium">Precios actualizados</Text>
            </View>
            <View className="flex-row items-center gap-4">
              <View className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <Text className="text-base text-slate-900 leading-6 font-medium">Navegación directa</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
