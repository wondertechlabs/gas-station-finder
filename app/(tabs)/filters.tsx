import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '~/constants/colors';
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
    { id: 'regular', name: 'Regular (87)', color: Colors.success },
    { id: 'super', name: 'Super (91)', color: Colors.warning },
    { id: 'diesel', name: 'Diesel', color: Colors.primary },
    { id: 'glp', name: 'GLP', color: Colors.accent },
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
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.headerSection}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Personaliza tu Búsqueda</Text>
            <Text style={styles.headerSubtitle}>
              Encuentra exactamente lo que necesitas
            </Text>
          </View>
        </View>

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
                    isSelected && { backgroundColor: fuel.color }
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
              trackColor={{ false: Colors.gray200, true: Colors.primary }}
              thumbColor={Colors.background}
            />
          </View>

          <View style={styles.switchContainer}>
            <Text style={styles.switchLabel}>Con servicios adicionales</Text>
            <Switch
              value={filters.hasAmenities}
              onValueChange={(value) => updateFilter('hasAmenities', value)}
              trackColor={{ false: Colors.gray200, true: Colors.primary }}
              thumbColor={Colors.background}
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
    backgroundColor: Colors.backgroundSecondary,
    paddingTop: 0,
  },
  scrollView: {
    flex: 1,
  },
  headerSection: {
    marginBottom: 16,
  },
  header: {
    padding: 24,
    paddingTop: 32,
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray100,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  section: {
    backgroundColor: Colors.background,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.gray200,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 16,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  optionButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.gray200,
    backgroundColor: Colors.gray50,
  },
  brandButton: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.gray200,
    backgroundColor: Colors.gray50,
    minWidth: 100,
    alignItems: 'center',
  },
  selectedBrandButton: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  optionText: {
    fontSize: 15,
    color: Colors.text,
    fontWeight: '600',
  },
  selectedText: {
    color: Colors.textInverse,
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
    color: Colors.text,
    fontWeight: '500',
  },
});