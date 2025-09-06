import { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Switch,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NICARAGUA_GAS_BRANDS } from '~/types/gasStation';

export default function FiltersTab() {
  const [filters, setFilters] = useState({
    distance: 5,
    fuelTypes: ['regular', 'super', 'diesel'],
    brands: [] as string[],
    is24Hours: false,
    hasAmenities: false,
  });

  const updateFilter = (key: string, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const FUEL_TYPES = [
    { id: 'regular', name: 'Regular (87)', color: '#22c55e' },
    { id: 'super', name: 'Super (91)', color: '#f59e0b' },
    { id: 'diesel', name: 'Diesel', color: '#2563eb' },
    { id: 'glp', name: 'GLP', color: '#10b981' },
  ];

  const GAS_BRANDS = NICARAGUA_GAS_BRANDS.map(brand => ({
    id: brand.toLowerCase().replace(/\s+/g, '-'),
    name: brand,
  })).filter(brand => brand.name === 'UNO Gas' || brand.name === 'Puma');


  const toggleFuelType = (fuelId: string) => {
    const currentTypes = filters.fuelTypes;
    if (currentTypes.includes(fuelId)) {
      updateFilter('fuelTypes', currentTypes.filter(id => id !== fuelId));
    } else {
      updateFilter('fuelTypes', [...currentTypes, fuelId]);
    }
  };

  const toggleBrand = (brandId: string) => {
    const currentBrands = filters.brands;
    if (currentBrands.includes(brandId)) {
      updateFilter('brands', currentBrands.filter(id => id !== brandId));
    } else {
      updateFilter('brands', [...currentBrands, brandId]);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50 pt-0">
      <ScrollView className="flex-1">
        <View className="bg-white mx-4 my-2 rounded-2xl p-5 border border-slate-200">
          <Text className="text-xl font-bold text-slate-900 mb-4">Tipo de Combustible</Text>
          <View className="flex-row flex-wrap gap-3">
            {FUEL_TYPES.map((fuel) => {
              const isSelected = filters.fuelTypes.includes(fuel.id);
              return (
                <TouchableOpacity
                  key={fuel.id}
                  className={`px-5 py-3 rounded-2xl border border-slate-200 ${
                    isSelected ? '' : 'bg-slate-50'
                  }`}
                  style={isSelected ? { backgroundColor: fuel.color } : {}}
                  onPress={() => toggleFuelType(fuel.id)}
                >
                  <Text className={`text-sm font-semibold ${
                    isSelected ? 'text-white font-bold' : 'text-slate-900'
                  }`}>
                    {fuel.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View className="bg-white mx-4 my-2 rounded-2xl p-5 border border-slate-200">
          <Text className="text-xl font-bold text-slate-900 mb-4">Marcas Preferidas</Text>
          <View className="flex-row flex-wrap gap-3">
            {GAS_BRANDS.map((brand) => {
              const isSelected = filters.brands.includes(brand.id);
              return (
                <TouchableOpacity
                  key={brand.id}
                  className={`px-5 py-3.5 rounded-2xl border border-slate-200 min-w-[100px] items-center ${
                    isSelected ? 'bg-blue-600 border-blue-600' : 'bg-slate-50'
                  }`}
                  onPress={() => toggleBrand(brand.id)}
                >
                  <Text className={`text-sm font-semibold ${
                    isSelected ? 'text-white font-bold' : 'text-slate-900'
                  }`}>
                    {brand.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View className="bg-white mx-4 my-2 rounded-2xl p-5 border border-slate-200">
          <Text className="text-xl font-bold text-slate-900 mb-4">Servicios</Text>

          <View className="flex-row justify-between items-center py-4 px-1">
            <Text className="text-base text-slate-900 font-medium">Solo 24 horas</Text>
            <Switch
              value={filters.is24Hours}
              onValueChange={(value) => updateFilter('is24Hours', value)}
              trackColor={{ false: '#e2e8f0', true: '#2563eb' }}
              thumbColor="#ffffff"
            />
          </View>

          <View className="flex-row justify-between items-center py-4 px-1">
            <Text className="text-base text-slate-900 font-medium">Con servicios adicionales</Text>
            <Switch
              value={filters.hasAmenities}
              onValueChange={(value) => updateFilter('hasAmenities', value)}
              trackColor={{ false: '#e2e8f0', true: '#2563eb' }}
              thumbColor="#ffffff"
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
