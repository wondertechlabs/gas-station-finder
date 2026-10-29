import { useEffect, useMemo, useRef, useState } from 'react';
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
import { LocationUnavailable } from '~/presentation/components/location/LocationUnavailable';
import { ContentUnavailable } from '~/presentation/components/ui/ContentUnavailable';
import { FadeIn, useWasLoading } from '~/presentation/components/ui/FadeIn';
import { LoadingScreen } from '~/presentation/components/ui/LoadingScreen';
import { useGasStations } from '~/presentation/hooks/useGasStations';
import { useLocation } from '~/presentation/hooks/useLocation';
import { colors } from '~/presentation/theme/colors';

export default function ListTab() {
  const {
    isLoading: locationLoading,
    error: locationError,
    getCurrentLocation,
  } = useLocation();
  const { gasStations, isLoading, isShowingPrevious, error, refetch, retry } =
    useGasStations();
  const fadeIn = useWasLoading(locationLoading || isLoading);
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

  const selectDepartment = (id: DepartmentId | null) => {
    if (id !== department) Haptics.selectionAsync();
    setDepartment(id);
  };

  const visibleStations = useMemo(
    () =>
      department
        ? gasStations.filter((station) => station.department === department)
        : gasStations,
    [gasStations, department],
  );

  // El barrido de MapKit y el filtro cambian la lista: las filas se deslizan
  // a su nuevo lugar en vez de saltar bajo el dedo.
  const listRef = useRef<FlashListRef<GasStation>>(null);
  const [shownStations, setShownStations] = useState(visibleStations);
  useEffect(() => {
    if (shownStations === visibleStations) return;
    if (shownStations.length > 0) {
      listRef.current?.prepareForLayoutAnimationRender();
      LayoutAnimation.configureNext(
        LayoutAnimation.create(200, 'easeInEaseOut', 'opacity'),
      );
    }
    // Intencional: la animación debe configurarse antes del commit que cambia
    // la lista, así que la nueva lista se aplica un render después.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setShownStations(visibleStations);
  }, [visibleStations, shownStations]);

  const header = (
    <>
      <Stack.Title large>
        {department ? departmentName(department) : 'Estaciones'}
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

  if (locationLoading) {
    return (
      <>
        <LoadingScreen message="Obteniendo ubicación..." />
        {header}
      </>
    );
  }

  if (locationError) {
    return (
      <LocationUnavailable error={locationError} onRetry={getCurrentLocation} />
    );
  }

  if (isLoading) {
    return (
      <>
        <LoadingScreen message="Buscando gasolineras..." />
        {header}
      </>
    );
  }

  if (error) {
    return (
      <ContentUnavailable
        title="No se pudieron cargar las gasolineras"
        message="Revisa tu conexión a internet e inténtalo de nuevo."
        icon="alert"
        actionLabel="Reintentar"
        onAction={retry}
      />
    );
  }

  if (visibleStations.length === 0) {
    return (
      <>
        {header}
        {department ? (
          <ContentUnavailable
            title={`Sin gasolineras en ${departmentName(department)}`}
            message="Puede que aún se estén cargando las de todo el país."
            icon="search"
            actionLabel="Ver todo el país"
            onAction={() => setDepartment(null)}
          />
        ) : (
          <ContentUnavailable
            title="No hay gasolineras"
            message="No encontramos gasolineras cerca de esta ubicación. Prueba con otra ciudad."
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
      <FadeIn enabled={fadeIn}>
        <FlashList
          ref={listRef}
          data={shownStations}
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
                ? 'Actualizando para la nueva ubicación…'
                : `${
                    shownStations.length === 1
                      ? '1 gasolinera'
                      : `${shownStations.length} gasolineras`
                  } · por distancia · precios estimados en C$`}
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
