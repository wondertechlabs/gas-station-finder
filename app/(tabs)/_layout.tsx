import { NativeTabs, Icon, Label } from 'expo-router/unstable-native-tabs';

export default function TabLayout() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger name='index'>
        <Icon sf="map.fill" drawable="map" />
        <Label>Mapa</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name='list'>
        <Icon sf="list.bullet" drawable="list" />
        <Label>Estaciones</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
