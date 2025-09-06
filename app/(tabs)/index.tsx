import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';


export default function MapTab() {
  return (
    <ScrollView className="flex-1 bg-slate-50" showsVerticalScrollIndicator={false}>
      <View
        className="flex-1 justify-center items-center p-8 m-4 rounded-3xl bg-white"
        style={{
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.08,
          shadowRadius: 12,
          elevation: 4,
        }}
      >
        <View
          className="mb-8 p-8 bg-gradient-to-br from-blue-50 to-blue-100 rounded-3xl"
          style={{
            shadowColor: '#2563eb',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 3,
          }}
        >
          <Ionicons name="map" size={72} color="#2563eb" />
        </View>
        <Text className="text-3xl font-bold text-slate-900 mb-4 text-center">Mapa Interactivo</Text>
        <Text className="text-base text-slate-600 text-center leading-7 mb-8 max-w-[300px]">
          El mapa estará disponible próximamente con todas las estaciones de servicio de Managua
        </Text>

        <View
          className="bg-gradient-to-r from-emerald-500 to-emerald-600 px-8 py-4 rounded-2xl"
          style={{
            shadowColor: '#10b981',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 4,
          }}
        >
          <Text className="text-base font-bold text-white">Próximamente</Text>
        </View>
      </View>

      <View
        className="bg-white m-4 rounded-3xl"
        style={{
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.05,
          shadowRadius: 8,
          elevation: 3,
        }}
      >
        <View className="p-6 pb-4 border-b border-slate-100">
          <Text className="text-xl font-bold text-slate-900 text-center">Características del Mapa</Text>
          <Text className="text-sm text-slate-500 text-center mt-2">Funcionalidades que estarán disponibles</Text>
        </View>

        <View className="p-6 pt-6 gap-6">
          <View className="flex-row items-center gap-5">
            <View
              className="w-4 h-4 rounded-full bg-green-500"
              style={{
                shadowColor: '#22c55e',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.3,
                shadowRadius: 4,
                elevation: 2,
              }}
            />
            <Text className="text-base text-slate-900 leading-6 font-semibold">Ubicación en tiempo real</Text>
          </View>
          <View className="flex-row items-center gap-5">
            <View
              className="w-4 h-4 rounded-full bg-cyan-500"
              style={{
                shadowColor: '#06b6d4',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.3,
                shadowRadius: 4,
                elevation: 2,
              }}
            />
            <Text className="text-base text-slate-900 leading-6 font-semibold">Estaciones cercanas</Text>
          </View>
          <View className="flex-row items-center gap-5">
            <View
              className="w-4 h-4 rounded-full bg-amber-500"
              style={{
                shadowColor: '#f59e0b',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.3,
                shadowRadius: 4,
                elevation: 2,
              }}
            />
            <Text className="text-base text-slate-900 leading-6 font-semibold">Precios actualizados</Text>
          </View>
          <View className="flex-row items-center gap-5">
            <View
              className="w-4 h-4 rounded-full bg-emerald-500"
              style={{
                shadowColor: '#10b981',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.3,
                shadowRadius: 4,
                elevation: 2,
              }}
            />
            <Text className="text-base text-slate-900 leading-6 font-semibold">Navegación directa</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
