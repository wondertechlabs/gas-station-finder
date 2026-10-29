import { useMemo, useRef, useState } from 'react';
import { LayoutAnimation, Text, View } from 'react-native';
import { router, Stack } from 'expo-router';
import { FlashList, type FlashListRef } from '@shopify/flash-list';
import * as Haptics from 'expo-haptics';
import type { GasStation } from '~/domain/gasStation/models';
import {
  DEPARTMENTS,
  departmentName,
  type DepartmentId,
} from '~/domain/location/departments';
import { GasStationCard } from '~/presentation/components/gas-station/GasStationCard';
import { GasStationListSkeleton } from '~/presentation/components/gas-station/GasStationListSkeleton';
import { GasStationsError } from '~/presentation/components/gas-station/GasStationsError';
import { LocationUnavailable } from '~/presentation/components/location/LocationUnavailable';
import { ContentUnavailable } from '~/presentation/components/ui/ContentUnavailable';
import { FadeIn } from '~/presentation/components/ui/FadeIn';
import { useGasStations } from '~/presentation/hooks/useGasStations';
import { useLocation } from '~/presentation/hooks/useLocation';
import { colors } from '~/presentation/theme/colors';

export default function ListTab() {
  const { isLoading: locationLoading, error: locationError } = useLocation();
  const { gasStations, isLoading, isShowingPrevious, error, refetch } =
    useGasStations();
  const [department, setDepartment] = useState<DepartmentId | null>(null);
  // Solo el gesto de "tirar para recargar" muestra el spinner: el barrido de
  // MapKit dispara refetch en segundo plano y no debe mover la lista.
  const [isPullRefreshing, setIsPullRefreshing] = useState(false);

  const handlePullRefresh = async () => {
    setIsPullRefreshing(true);
    try {
      await refetch();
    } finally {
      setIsPullRefreshing(false);
    }
  };

  // Al cambiar de departamento las filas se deslizan en vez de saltar.
  const listRef = useRef<FlashListRef<GasStation>>(null);
  const selectDepartment = (id: DepartmentId | null) => {
    if (id === department) return;
    Haptics.selectionAsync();
    listRef.current?.prepareForLayoutAnimationRender();
    LayoutAnimation.configureNext(
      LayoutAnimation.create(200, 'easeInEaseOut', 'opacity'),
    );
    setDepartment(id);
  };

  const visibleStations = useMemo(
    () =>
      department
        ? gasStations.filter((station) => station.department === department)
        : gasStations,
    [gasStations, department],
  );

  const header = (
    <>
      <Stack.Title large>
        {department ? departmentName(department) : 'Gasolineras'}
      </Stack.Title>
      <Stack.Toolbar placement="right">
        <Stack.Toolbar.Menu
          icon={
            department
              ? 'line.3.horizontal.decrease.circle.fill'
              : 'line.3.horizontal.decrease.circle'
          }
          accessibilityLabel="Filtrar por departamento"
          title="Departamento"
        >
          <Stack.Toolbar.Menu inline>
            <Stack.Toolbar.MenuAction
              icon="map"
              isOn={department === null}
              onPress={() => selectDepartment(null)}
            >
              Todo el país
            </Stack.Toolbar.MenuAction>
          </Stack.Toolbar.Menu>
          {DEPARTMENTS.map(({ id, name }) => (
            <Stack.Toolbar.MenuAction
              key={id}
              isOn={department === id}
              onPress={() => selectDepartment(id)}
            >
              {name}
            </Stack.Toolbar.MenuAction>
          ))}
        </Stack.Toolbar.Menu>
      </Stack.Toolbar>
    </>
  );

  if (locationError) {
    return <LocationUnavailable error={locationError} />;
  }

  if (locationLoading || isLoading) {
    return (
      <>
        <GasStationListSkeleton />
        {header}
      </>
    );
  }

  if (error) {
    return <GasStationsError onRetry={refetch} />;
  }

  if (visibleStations.length === 0) {
    return (
      <>
        {header}
        {department ? (
          <ContentUnavailable
            title={`Sin gasolineras en ${departmentName(department)}`}
            icon="search"
            actionLabel="Ver todo el país"
            onAction={() => selectDepartment(null)}
          />
        ) : (
          <ContentUnavailable
            title="No hay gasolineras cerca"
            icon="search"
            actionLabel="Buscar otra ciudad"
            onAction={() => router.navigate('/search')}
          />
        )}
      </>
    );
  }

  return (
    <>
      <FadeIn>
        <FlashList
          ref={listRef}
          data={visibleStations}
          keyExtractor={(item: GasStation) => item.id}
          renderItem={({ item }) => <GasStationCard station={item} />}
          ItemSeparatorComponent={Separator}
          ListHeaderComponent={
            <Text
              style={{
                paddingHorizontal: 4,
                paddingBottom: 10,
                fontSize: 13,
                color: colors.secondaryLabel,
              }}
            >
              {isShowingPrevious
                ? 'Actualizando…'
                : visibleStations.length === 1
                  ? '1 gasolinera'
                  : `${visibleStations.length} gasolineras`}
            </Text>
          }
          contentInsetAdjustmentBehavior="automatic"
          style={{ backgroundColor: colors.groupedBackground }}
          contentContainerStyle={{ padding: 16 }}
          refreshing={isPullRefreshing}
          onRefresh={handlePullRefresh}
        />
      </FadeIn>
      {header}
    </>
  );
}

function Separator() {
  return <View style={{ height: 10 }} />;
}
