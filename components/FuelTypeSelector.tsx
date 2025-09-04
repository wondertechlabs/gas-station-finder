import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface FuelTypeSelectorProps {
  selectedTypes: string[];
  onSelectionChange: (types: string[]) => void;
}

const FUEL_TYPES = [
  { id: 'regular', name: 'Regular (87)', color: '#10b981' },
  { id: 'super', name: 'Super (91)', color: '#f59e0b' },
  { id: 'diesel', name: 'Diesel', color: '#6366f1' },
  { id: 'glp', name: 'GLP', color: '#ec4899' },
];

export function FuelTypeSelector({ selectedTypes, onSelectionChange }: FuelTypeSelectorProps) {
  const toggleFuelType = (fuelId: string) => {
    if (selectedTypes.includes(fuelId)) {
      onSelectionChange(selectedTypes.filter(id => id !== fuelId));
    } else {
      onSelectionChange([...selectedTypes, fuelId]);
    }
  };

  return (
    <View style={styles.container}>
      {FUEL_TYPES.map((fuel) => {
        const isSelected = selectedTypes.includes(fuel.id);
        return (
          <TouchableOpacity
            key={fuel.id}
            style={[
              styles.fuelButton,
              isSelected && { backgroundColor: fuel.color, borderColor: fuel.color }
            ]}
            onPress={() => toggleFuelType(fuel.id)}
          >
            <Text style={[
              styles.fuelText,
              isSelected && styles.selectedText
            ]}>
              {fuel.name}
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
  fuelButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    backgroundColor: '#f8fafc',
  },
  fuelText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  selectedText: {
    color: '#ffffff',
    fontWeight: '600',
  },
});