import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Search, RotateCcw } from 'lucide-react-native';

interface SearchRadiusProps {
  radius: number;
  onRadiusChange: (radius: number) => void;
  loading: boolean;
}

const RADIUS_OPTIONS = [1000, 2000, 5000, 10000, 15000]; // meters

export function SearchRadius({ radius, onRadiusChange, loading }: SearchRadiusProps) {
  const formatRadius = (meters: number): string => {
    if (meters < 1000) {
      return `${meters}m`;
    }
    return `${meters / 1000}km`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Search size={16} color="#6b7280" />
        <Text style={styles.title}>Radio de búsqueda</Text>
      </View>
      
      <View style={styles.optionsContainer}>
        {RADIUS_OPTIONS.map((option) => (
          <TouchableOpacity
            key={option}
            style={[
              styles.radiusButton,
              radius === option && styles.selectedButton,
              loading && styles.disabledButton,
            ]}
            onPress={() => !loading && onRadiusChange(option)}
            disabled={loading}
          >
            <Text style={[
              styles.radiusText,
              radius === option && styles.selectedText,
            ]}>
              {formatRadius(option)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading && (
        <View style={styles.loadingContainer}>
          <RotateCcw size={16} color="#3b82f6" />
          <Text style={styles.loadingText}>Buscando...</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 60,
    left: 16,
    right: 16,
    backgroundColor: '#ffffff',
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  optionsContainer: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  radiusButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#f9fafb',
  },
  selectedButton: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  disabledButton: {
    opacity: 0.5,
  },
  radiusText: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  selectedText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    gap: 6,
  },
  loadingText: {
    fontSize: 14,
    color: '#3b82f6',
    fontWeight: '500',
  },
});