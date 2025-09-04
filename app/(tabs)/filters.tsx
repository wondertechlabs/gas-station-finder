import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function FiltersTab() {
  const [filters, setFilters] = useState({
    distance: 5,
    fuelTypes: ['regular', 'super', 'diesel'],
    brands: [],
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
    { id: 'regular', name: 'Regular (87)', color: '#10b981' },
    { id: 'super', name: 'Super (91)', color: '#f59e0b' },
    { id: 'diesel', name: 'Diesel', color: '#6366f1' },
    { id: 'glp', name: 'GLP', color: '#ec4899' },
  ];

  const GAS_BRANDS = [
    { id: 'petronic', name: 'Petronic' },
    { id: 'shell', name: 'Shell' },
    { id: 'texaco', name: 'Texaco' },
    { id: 'uno', name: 'UNO Gas' },
    { id: 'puma', name: 'Puma' },
    { id: 'esso', name: 'Esso' },
  ];

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
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tipo de Combustible</Text>
          <View style={styles.optionsContainer}>
            {FUEL_TYPES.map((fuel) => {
              const isSelected = filters.fuelTypes.includes(fuel.id);
              return (
                <TouchableOpacity
                  key={fuel.id}
                  style={[
                    styles.optionButton,
                    isSelected && { backgroundColor: fuel.color, borderColor: fuel.color }
                  ]}
                  onPress={() => toggleFuelType(fuel.id)}
                >
                  <Text style={[
                    styles.optionText,
                    isSelected && styles.selectedText
                  ]}>
                    {fuel.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Marcas Preferidas</Text>
          <View style={styles.optionsContainer}>
            {GAS_BRANDS.map((brand) => {
              const isSelected = filters.brands.includes(brand.id);
              return (
                <TouchableOpacity
                  key={brand.id}
                  style={[
                    styles.brandButton,
                    isSelected && styles.selectedBrandButton
                  ]}
                  onPress={() => toggleBrand(brand.id)}
                >
                  <Text style={[
                    styles.optionText,
                    isSelected && styles.selectedText
                  ]}>
                    {brand.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Servicios</Text>
          
          <View style={styles.switchContainer}>
            <Text style={styles.switchLabel}>Solo 24 horas</Text>
            <Switch
              value={filters.is24Hours}
              onValueChange={(value) => updateFilter('is24Hours', value)}
              trackColor={{ false: '#e2e8f0', true: '#3b82f6' }}
              thumbColor="#ffffff"
            />
          </View>

          <View style={styles.switchContainer}>
            <Text style={styles.switchLabel}>Con servicios adicionales</Text>
            <Switch
              value={filters.hasAmenities}
              onValueChange={(value) => updateFilter('hasAmenities', value)}
              trackColor={{ false: '#e2e8f0', true: '#3b82f6' }}
              thumbColor="#ffffff"
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    paddingTop: 0,
  },
  scrollView: {
    flex: 1,
    paddingTop: 8,
  },
  section: {
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 12,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    backgroundColor: '#f8fafc',
  },
  brandButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    backgroundColor: '#f8fafc',
    minWidth: 80,
    alignItems: 'center',
  },
  selectedBrandButton: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  optionText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  selectedText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  switchLabel: {
    fontSize: 16,
    color: '#374151',
  },
});