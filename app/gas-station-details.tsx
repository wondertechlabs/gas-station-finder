import { useMemo, type ReactNode } from 'react';
import { Pressable, Text } from 'react-native';
import * as Linking from 'expo-linking';
import { FlashList } from '@shopify/flash-list';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useQueryClient } from '@tanstack/react-query';
import type { GasStation } from '~/domain/gasStation/models';
import { StationsMap } from '~/presentation/components/map/StationsMap';
import { AppIcon } from '~/presentation/components/ui/AppIcon';
import { ContentUnavailable } from '~/presentation/components/ui/ContentUnavailable';
import {
  GroupedCell,
  GroupedHeader,
  GroupedRow,
} from '~/presentation/components/ui/GroupedSection';
import {
  NAVIGATION_APPS,
  useGasStationActions,
} from '~/presentation/hooks/useGasStationActions';
import { gasStationKeys } from '~/presentation/hooks/useGasStations';
import { colors } from '~/presentation/theme/colors';
import {
  formatDistance,
  openStatus,
} from '~/presentation/utils/gasStationFormat';
import { MAP_CONFIG } from '~/shared/constants';

type DetailItem =
  | { type: 'map'; key: string }
  | { type: 'header'; key: string; title: string }
  | { type: 'cell'; key: string; content: ReactNode; onPress?: () => void };

export default function GasStationDetailsScreen() {
  const { stationId } = useLocalSearchParams<{ stationId: string }>();
  const queryClient = useQueryClient();
  const { handleNavigate } = useGasStationActions();

  const station: GasStation | null = useMemo(() => {
    if (!stationId) return null;

    const queries = queryClient.getQueriesData<GasStation[]>({
      queryKey: gasStationKeys.lists(),
    });

    for (const [, data] of queries) {
      const found = data?.find((s) => s.id === stationId);
      if (found) return found;
    }

    return null;
  }, [stationId, queryClient]);

  if (!station) {
    return (
      <ContentUnavailable
        title="Gasolinera no encontrada"
        icon="alert"
        actionLabel="Volver"
        onAction={() => router.back()}
      />
    );
  }

  const status = openStatus(station);

  const textStyle = { flex: 1, fontSize: 17, color: colors.label } as const;
  const items: DetailItem[] = [
    { type: 'map', key: 'map' },
    {
      type: 'cell',
      key: 'address',
      content: (
        <>
          <AppIcon name="pin" size={16} color={colors.secondaryLabel} />
          <Text selectable style={textStyle}>
            {station.address}
          </Text>
        </>
      ),
    },
  ];

  // MapKit no reporta horario ni rating: la fila solo aparece si hay datos.
  if (station.isOpen !== undefined || station.rating != null) {
    items.splice(1, 0, {
      type: 'cell',
      key: 'status',
      content: (
        <>
          <Text style={{ flex: 1, fontSize: 17, color: status.color }}>
            {status.label}
          </Text>
          {station.rating != null && (
            <>
              <AppIcon name="star" size={14} color={colors.yellow} />
              <Text style={[styles.value, { fontWeight: '400' }]}>
                {station.rating.toFixed(1)}
              </Text>
            </>
          )}
        </>
      ),
    });
  }
  if (station.distance != null) {
    items.push({
      type: 'cell',
      key: 'distance',
      content: (
        <>
          <AppIcon name="distance" size={16} color={colors.secondaryLabel} />
          <Text style={textStyle}>
            A {formatDistance(station.distance)} de distancia
          </Text>
        </>
      ),
    });
  }

  // Teléfono y web vienen de Apple Maps; muchas gasolineras no los tienen.
  const contactStart = items.length;
  if (station.phone) {
    const phone = station.phone;
    items.push({
      type: 'cell',
      key: 'phone',
      onPress: () => Linking.openURL(`tel:${phone.replace(/[^\d+]/g, '')}`),
      content: (
        <>
          <AppIcon name="phone" size={16} color={colors.secondaryLabel} />
          <Text style={[textStyle, { color: colors.tint }]}>{phone}</Text>
        </>
      ),
    });
  }
  if (station.website) {
    const website = station.website;
    items.push({
      type: 'cell',
      key: 'website',
      onPress: () => Linking.openURL(website),
      content: (
        <>
          <AppIcon name="website" size={16} color={colors.secondaryLabel} />
          <Text numberOfLines={1} style={[textStyle, { color: colors.tint }]}>
            {website.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')}
          </Text>
        </>
      ),
    });
  }
  if (items.length > contactStart) {
    items.splice(contactStart, 0, {
      type: 'header',
      key: 'h-contact',
      title: 'Contacto',
    });
  }

  if (station.amenities.length > 0) {
    items.push({ type: 'header', key: 'h-amenities', title: 'Servicios' });
    station.amenities.forEach((amenity) =>
      items.push({
        type: 'cell',
        key: `amenity-${amenity}`,
        content: <Text style={textStyle}>{amenity}</Text>,
      }),
    );
  }

  return (
    <>
      <FlashList
        data={items}
        keyExtractor={(item) => item.key}
        getItemType={(item) => item.type}
        renderItem={({ item, index }) => {
          switch (item.type) {
            case 'map':
              return (
                <StationsMap
                  style={{
                    height: 180,
                    marginBottom: 24,
                    borderRadius: 16,
                    borderCurve: 'continuous',
                    overflow: 'hidden',
                  }}
                  stations={[station]}
                  cameraPosition={{
                    coordinates: station.coordinates,
                    zoom: MAP_CONFIG.DETAIL_ZOOM,
                  }}
                  interactive={false}
                />
              );
            case 'header':
              return <GroupedHeader title={item.title} />;
            case 'cell': {
              // Las celdas contiguas forman una sección: se redondean los extremos.
              const first = items[index - 1]?.type !== 'cell';
              const last = items[index + 1]?.type !== 'cell';
              const row = <GroupedRow last={last}>{item.content}</GroupedRow>;

              return (
                <GroupedCell first={first} last={last}>
                  {item.onPress ? (
                    <Pressable
                      onPress={item.onPress}
                      style={({ pressed }) => ({
                        backgroundColor: pressed
                          ? colors.cellHighlight
                          : 'transparent',
                      })}
                    >
                      {row}
                    </Pressable>
                  ) : (
                    row
                  )}
                </GroupedCell>
              );
            }
          }
        }}
        contentInsetAdjustmentBehavior="automatic"
        style={{ backgroundColor: colors.groupedBackground }}
        contentContainerStyle={{ padding: 16 }}
      />

      <Stack.Title>{station.name}</Stack.Title>
      <Stack.Toolbar placement="bottom">
        <Stack.Toolbar.Spacer />
        {/* Sin tintColor el SF Symbol se pinta en modo 'original' y queda invisible
            sobre el fondo prominent: se fuerza 'template' para que tome el color del botón. */}
        <Stack.Toolbar.Menu
          icon="arrow.triangle.turn.up.right.diamond.fill"
          iconRenderingMode="template"
          variant="prominent"
          title="Cómo llegar"
          accessibilityLabel="Cómo llegar"
        >
          {NAVIGATION_APPS.map(({ app, label, icon }) => (
            <Stack.Toolbar.MenuAction
              key={app}
              icon={icon}
              onPress={() => handleNavigate(station, app)}
            >
              {label}
            </Stack.Toolbar.MenuAction>
          ))}
        </Stack.Toolbar.Menu>
        <Stack.Toolbar.Spacer />
      </Stack.Toolbar>
    </>
  );
}

const styles = {
  value: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.secondaryLabel,
    fontVariant: ['tabular-nums'],
  },
} as const;
