import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';

interface DistanceSliderProps {
  value: number;
  onValueChange: (value: number) => void;
}

export function DistanceSlider({ value, onValueChange }: DistanceSliderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>Distancia máxima</Text>
        <Text style={styles.value}>{value} km</Text>
      </View>
      <Slider
        style={styles.slider}
        minimumValue={1}
        maximumValue={20}
        value={value}
        onValueChange={onValueChange}
        step={1}
        minimumTrackTintColor="#3b82f6"
        maximumTrackTintColor="#e2e8f0"
        thumbStyle={styles.thumb}
      />
      <View style={styles.labels}>
        <Text style={styles.labelText}>1 km</Text>
        <Text style={styles.labelText}>20 km</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    color: '#374151',
  },
  value: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3b82f6',
  },
  slider: {
    width: '100%',
    height: 40,
  },
  thumb: {
    backgroundColor: '#3b82f6',
    width: 20,
    height: 20,
  },
  labels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  labelText: {
    fontSize: 12,
    color: '#64748b',
  },
});