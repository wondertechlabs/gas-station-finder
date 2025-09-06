import { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Switch,
  TouchableOpacity,
} from 'react-native';
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
    <ScrollView className="flex-1 bg-slate-50" showsVerticalScrollIndicator={false}>
      <View className="pt-6 pb-8">
        <View 
          className="bg-white mx-4 mb-4 rounded-3xl p-6"
          style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.05,
            shadowRadius: 8,
            elevation: 3,
          }}
        >
          <Text className="text-xl font-bold text-slate-900 mb-2">Tipo de Combustible</Text>
          <Text className="text-sm text-slate-500 mb-6">Selecciona los tipos que necesitas</Text>
          <View className="flex-row flex-wrap gap-3">
            {FUEL_TYPES.map((fuel) => {
              const isSelected = filters.fuelTypes.includes(fuel.id);
              return (
                <TouchableOpacity
                  key={fuel.id}
                  className={`px-6 py-4 rounded-2xl border-2 ${isSelected ? 'border-transparent' : 'border-slate-200 bg-slate-50'}`}
                  style={isSelected ? { 
                    backgroundColor: fuel.color,
                    shadowColor: fuel.color,
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.2,
                    shadowRadius: 4,
                    elevation: 2,
                  } : {}}
                  onPress={() => toggleFuelType(fuel.id)}
                >
                  <Text className={`text-sm font-bold ${isSelected ? 'text-white' : 'text-slate-700'}`}>
                    {fuel.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View 
          className="bg-white mx-4 mb-4 rounded-3xl p-6"
          style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.05,
            shadowRadius: 8,
            elevation: 3,
          }}
        >
          <Text className="text-xl font-bold text-slate-900 mb-2">Marcas Preferidas</Text>
          <Text className="text-sm text-slate-500 mb-6">Filtra por marcas específicas</Text>
          <View className="flex-row flex-wrap gap-3">
            {GAS_BRANDS.map((brand) => {
              const isSelected = filters.brands.includes(brand.id);
              return (
                <TouchableOpacity
                  key={brand.id}
                  className={`px-6 py-4 rounded-2xl border-2 min-w-[120px] items-center ${isSelected ? 'border-blue-600 bg-blue-600' : 'border-slate-200 bg-slate-50'}`}
                  style={isSelected ? {
                    shadowColor: '#2563eb',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.2,
                    shadowRadius: 4,
                    elevation: 2,
                  } : {}}
                  onPress={() => toggleBrand(brand.id)}
                >
                  <Text className={`text-sm font-bold ${isSelected ? 'text-white' : 'text-slate-700'}`}>
                    {brand.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View 
          className="bg-white mx-4 mb-6 rounded-3xl p-6"
          style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.05,
            shadowRadius: 8,
            elevation: 3,
          }}
        >
          <Text className="text-xl font-bold text-slate-900 mb-2">Servicios</Text>
          <Text className="text-sm text-slate-500 mb-6">Filtros adicionales</Text>

          <View className="flex-row justify-between items-center py-5 px-2 border-b border-slate-100">
            <View className="flex-1">
              <Text className="text-base text-slate-900 font-semibold">Solo 24 horas</Text>
              <Text className="text-sm text-slate-500 mt-1">Estaciones abiertas todo el día</Text>
            </View>
            <Switch
              value={filters.is24Hours}
              onValueChange={(value) => updateFilter('is24Hours', value)}
              trackColor={{ false: '#e2e8f0', true: '#2563eb' }}
              thumbColor="#ffffff"
            />
          </View>

          <View className="flex-row justify-between items-center py-5 px-2">
            <View className="flex-1">
              <Text className="text-base text-slate-900 font-semibold">Con servicios adicionales</Text>
              <Text className="text-sm text-slate-500 mt-1">Tienda, lavado, ATM, etc.</Text>
            </View>
            <Switch
              value={filters.hasAmenities}
              onValueChange={(value) => updateFilter('hasAmenities', value)}
              trackColor={{ false: '#e2e8f0', true: '#2563eb' }}
              thumbColor="#ffffff"
            />
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
