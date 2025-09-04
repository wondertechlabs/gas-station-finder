import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface BrandSelectorProps {
  selectedBrands: string[];
  onSelectionChange: (brands: string[]) => void;
}

const GAS_BRANDS = [
  { id: 'petronic', name: 'Petronic', color: '#dc2626' },
  { id: 'shell', name: 'Shell', color: '#fbbf24' },
  { id: 'texaco', name: 'Texaco', color: '#dc2626' },
  { id: 'uno', name: 'UNO Gas', color: '#059669' },
  { id: 'puma', name: 'Puma', color: '#7c3aed' },
  { id: 'esso', name: 'Esso', color: '#1f2937' },
];

export function BrandSelector({ selectedBrands, onSelectionChange }: BrandSelectorProps) {
  const toggleBrand = (brandId: string) => {
    if (selectedBrands.includes(brandId)) {
      onSelectionChange(selectedBrands.filter(id => id !== brandId));
    } else {
      onSelectionChange([...selectedBrands, brandId]);
    }
  };

  return (
    <View style={styles.container}>
      {GAS_BRANDS.map((brand) => {
        const isSelected = selectedBrands.includes(brand.id);
        return (
          <TouchableOpacity
            key={brand.id}
            style={[
              styles.brandButton,
              isSelected && { backgroundColor: brand.color, borderColor: brand.color }
            ]}
            onPress={() => toggleBrand(brand.id)}
          >
            <Text style={[
              styles.brandText,
              isSelected && styles.selectedText
            ]}>
              {brand.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
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
  brandText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  selectedText: {
    color: '#ffffff',
    fontWeight: '600',
  },
});