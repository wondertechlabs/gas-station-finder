import { Platform } from 'react-native';
import { Color } from 'expo-router';

// Colores semánticos del sistema: se adaptan solos a claro/oscuro y a accesibilidad.
export const colors = {
  label: Platform.select({
    ios: Color.ios.label,
    default: '#000000',
  })!,
  secondaryLabel: Platform.select({
    ios: Color.ios.secondaryLabel,
    default: '#3c3c43',
  })!,
  tertiaryLabel: Platform.select({
    ios: Color.ios.tertiaryLabel,
    default: '#8e8e93',
  })!,
  separator: Platform.select({
    ios: Color.ios.separator,
    default: '#c6c6c8',
  })!,
  groupedBackground: Platform.select({
    ios: Color.ios.systemGroupedBackground,
    default: '#f2f2f7',
  })!,
  cellBackground: Platform.select({
    ios: Color.ios.secondarySystemGroupedBackground,
    default: '#ffffff',
  })!,
  cellHighlight: Platform.select({
    ios: Color.ios.systemGray4,
    default: '#d1d1d6',
  })!,
  fill: Platform.select({
    ios: Color.ios.tertiarySystemFill,
    default: '#7676801f',
  })!,
  tint: Platform.select({
    ios: Color.ios.systemGreen,
    default: '#22c55e',
  })!,
  green: Platform.select({
    ios: Color.ios.systemGreen,
    default: '#34c759',
  })!,
  yellow: Platform.select({
    ios: Color.ios.systemYellow,
    default: '#ffcc00',
  })!,
};
