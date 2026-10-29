import { useMemo, useState } from 'react';
import { Text, View } from 'react-native';
import { Stack } from 'expo-router';
import { FlashList } from '@shopify/flash-list';
import type { GasStation } from '~/domain/gasStation/models';
import {
  DEPARTMENTS,
  departmentName,
  type DepartmentId,
} from '~/domain/location/departments';
import { GasStationCard } from '~/presentation/components/gas-station/GasStationCard';
import { ContentUnavailable } from '~/presentation/components/ui/ContentUnavailable';
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
  const { gasStations, isLoading, error, refetch } = useGasStations();
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
              onPress={() => setDepartment(null)}
            >
              Todo el país
            </Stack.Toolbar.MenuAction>
          </Stack.Toolbar.Menu>
          {DEPARTMENTS.map(({ id, name }) => (
            <Stack.Toolbar.MenuAction
              key={id}
              isOn={department === id}
              onPress={() => setDepartment(id)}
            >
              {name}
            </Stack.Toolbar.MenuAction>
          ))}
        </Stack.Toolbar.Menu>
      </Stack.Toolbar>
    </>
  );

  if (locationLoading) {
    return <LoadingScreen message="Obteniendo ubicación..." />;
  }

  if (locationError) {
    return (
      <ContentUnavailable
        title="Ubicación no disponible"
        message={locationError}
        icon="location"
        actionLabel="Reintentar"
        onAction={getCurrentLocation}
      />
    );
  }

  if (isLoading) {
    return <LoadingScreen message="Buscando gasolineras..." />;
  }

  if (error) {
    return (
      <ContentUnavailable
        title="No se pudieron cargar"
        message={error.message}
        icon="alert"
        actionLabel="Reintentar"
        onAction={refetch}
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
            message="No encontramos gasolineras cercanas"
            icon="search"
          />
        )}
      </>
    );
  }

  return (
    <>
      <FlashList
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
            {visibleStations.length === 1
              ? '1 gasolinera'
              : `${visibleStations.length} gasolineras`}{' '}
            · por distancia · precios estimados en C$
          </Text>
        }
        contentInsetAdjustmentBehavior="automatic"
        style={{ backgroundColor: colors.groupedBackground }}
        contentContainerStyle={{ padding: 16 }}
        refreshing={isPullRefreshing}
        onRefresh={handlePullRefresh}
      />
      {header}
    </>
  );
}

function Separator() {
  return <View style={{ height: 10 }} />;
}
