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
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/colors';

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
    { id: 'regular', name: 'Regular (87)', color: Colors.success[500] },
    { id: 'super', name: 'Super (91)', color: Colors.warning[500] },
    { id: 'diesel', name: 'Diesel', color: Colors.primary[500] },
    { id: 'glp', name: 'GLP', color: Colors.accent[500] },
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
        <View style={styles.headerSection}>
          <LinearGradient
            colors={[Colors.primary[500], Colors.secondary[500]]}
            style={styles.headerGradient}
          >
            <Text style={styles.headerTitle}>Personaliza tu Búsqueda</Text>
            <Text style={styles.headerSubtitle}>
              Encuentra exactamente lo que necesitas
            </Text>
          </LinearGradient>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tipo de Combustible</Text>
          <View style={styles.optionsContainer}>
            {FUEL_TYPES.map((fuel) => {
              const isSelected = filters.fuelTypes.includes(fuel.id);
              return (
                <TouchableOpacity
                  key={fuel.id}
                  style={isSelected ? styles.selectedFuelButton : styles.optionButton}
                  onPress={() => toggleFuelType(fuel.id)}
                >
                  {isSelected ? (
                    <LinearGradient colors={[fuel.color, fuel.color + 'CC']} style={[
                    styles.optionButton,
                    styles.gradientButton
                  ]}>
                      <Text style={styles.selectedText}>
                        {fuel.name}
                      </Text>
                    </LinearGradient>
                  ) : (
                    <Text style={styles.optionText}>
                      {fuel.name}
                    </Text>
                  )}
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
              trackColor={{ false: Colors.neutral[200], true: Colors.primary[500] }}
              thumbColor={Colors.background.secondary}
            />
          </View>

          <View style={styles.switchContainer}>
            <Text style={styles.switchLabel}>Con servicios adicionales</Text>
            <Switch
              value={filters.hasAmenities}
              onValueChange={(value) => updateFilter('hasAmenities', value)}
              trackColor={{ false: Colors.neutral[200], true: Colors.primary[500] }}
              thumbColor={Colors.background.secondary}
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
    backgroundColor: Colors.background.primary,
    paddingTop: 0,
  },
  scrollView: {
    flex: 1,
  },
  headerSection: {
    marginBottom: 8,
  },
  headerGradient: {
    padding: 24,
    paddingTop: 32,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text.inverse,
    textAlign: 'center',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: Colors.text.inverse,
    textAlign: 'center',
    opacity: 0.9,
  },
  section: {
    backgroundColor: Colors.background.secondary,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 16,
    padding: 16,
    shadowColor: Colors.neutral[900],
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 6,
    borderWidth: 1,
    borderColor: Colors.neutral[100],
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text.primary,
    marginBottom: 16,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  optionButton: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: Colors.neutral[200],
    backgroundColor: Colors.neutral[50],
  },
  selectedFuelButton: {
    borderRadius: 24,
  },
  gradientButton: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 24,
  },
  brandButton: {
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.neutral[200],
    backgroundColor: Colors.neutral[50],
    minWidth: 90,
    alignItems: 'center',
  },
  selectedBrandButton: {
    backgroundColor: Colors.primary[500],
    borderColor: Colors.primary[500],
  },
  optionText: {
    fontSize: 15,
    color: Colors.text.primary,
    fontWeight: '600',
  },
  selectedText: {
    color: Colors.text.inverse,
    fontWeight: '700',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 4,
  },
  switchLabel: {
    fontSize: 17,
    color: Colors.text.primary,
    fontWeight: '500',
  },
});