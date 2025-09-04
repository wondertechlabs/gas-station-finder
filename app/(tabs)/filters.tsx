import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
} from 'react-native';
import { FilterSection } from '@/components/FilterSection';
import { DistanceSlider } from '@/components/DistanceSlider';
import { FuelTypeSelector } from '@/components/FuelTypeSelector';
import { BrandSelector } from '@/components/BrandSelector';

export default function FiltersTab() {
  const [filters, setFilters] = useState({
    distance: 5, // km
    fuelTypes: ['regular', 'super', 'diesel'],
    brands: [],
    is24Hours: false,
    hasAmenities: false,
    priceRange: [0, 50], // NIO per liter
  });

  const updateFilter = (key: string, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Filtros de Búsqueda</Text>
        <Text style={styles.subtitle}>
          Personaliza tu búsqueda de estaciones
        </Text>
      </View>

      <FilterSection title="Distancia Máxima">
        <DistanceSlider
          value={filters.distance}
          onValueChange={(value) => updateFilter('distance', value)}
        />
      </FilterSection>

      <FilterSection title="Tipo de Combustible">
        <FuelTypeSelector
          selectedTypes={filters.fuelTypes}
          onSelectionChange={(types) => updateFilter('fuelTypes', types)}
        />
      </FilterSection>

      <FilterSection title="Marcas Preferidas">
        <BrandSelector
          selectedBrands={filters.brands}
          onSelectionChange={(brands) => updateFilter('brands', brands)}
        />
      </FilterSection>

      <FilterSection title="Servicios">
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
      </FilterSection>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    padding: 20,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
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