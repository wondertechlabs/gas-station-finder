import { NativeTabs } from 'expo-router/native-tabs';
import { useQuickActions } from '~/presentation/hooks/useQuickActions';
import { colors } from '~/presentation/theme/colors';

export default function TabLayout() {
  useQuickActions();

  return (
    <NativeTabs minimizeBehavior="onScrollDown" tintColor={colors.tint}>
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Icon sf="map.fill" md="map" />
        <NativeTabs.Trigger.Label>Mapa</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="list">
        <NativeTabs.Trigger.Icon sf="list.bullet" md="list" />
        <NativeTabs.Trigger.Label>Gasolineras</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="search" role="search">
        <NativeTabs.Trigger.Icon sf="magnifyingglass" md="search" />
        <NativeTabs.Trigger.Label>Buscar</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
