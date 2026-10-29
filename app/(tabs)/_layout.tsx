import { NativeTabs } from 'expo-router/native-tabs';
import { useGasStationsSync } from '~/presentation/hooks/useGasStations';
import { useQuickActions } from '~/presentation/hooks/useQuickActions';
import { colors } from '~/presentation/theme/colors';

export default function TabLayout() {
  return (
    <>
      <BackgroundSync />
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
    </>
  );
}

// Componente aparte para que sus re-renders no re-rendericen las tabs.
function BackgroundSync() {
  useGasStationsSync();
  useQuickActions();
  return null;
}
