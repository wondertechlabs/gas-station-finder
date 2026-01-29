import { NativeTabs, Icon, Label } from 'expo-router/unstable-native-tabs';
import { DynamicColorIOS } from 'react-native';

export default function TabLayout() {
  return (
    <NativeTabs
      minimizeBehavior="onScrollDown"
      labelStyle={{
        color: DynamicColorIOS({
          dark: '#22C55E',
          light: '#22C55E',
        }),
      }}
      tintColor={DynamicColorIOS({
        dark: '#22C55E',
        light: '#22C55E',
      })}
    >
      <NativeTabs.Trigger name="index">
        <Icon sf="map.fill" drawable="map" />
        <Label>Mapa</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="list">
        <Icon sf="list.bullet" drawable="list" />
        <Label>Estaciones</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="search" role="search">
        <Icon sf="magnifyingglass" drawable="magnifyingglass" />
        <Label>Buscar</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
