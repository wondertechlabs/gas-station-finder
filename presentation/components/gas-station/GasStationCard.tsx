import { memo } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Link } from 'expo-router';
import type { GasStation } from '~/domain/gasStation/models';
import { AppIcon } from '~/presentation/components/ui/AppIcon';
import {
  NAVIGATION_APPS,
  useGasStationActions,
} from '~/presentation/hooks/useGasStationActions';
import { colors } from '~/presentation/theme/colors';
import {
  formatDistance,
  openStatus,
} from '~/presentation/utils/gasStationFormat';

interface Props {
  station: GasStation;
}

// Compartidos con GasStationListSkeleton para que la silueta coincida.
export const cardStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 12,
  paddingVertical: 12,
  paddingHorizontal: 14,
  borderRadius: 14,
  borderCurve: 'continuous',
} as const;

export const iconCircleStyle = {
  width: 36,
  height: 36,
  borderRadius: 18,
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: colors.fill,
} as const;

// Fila compacta al estilo de los resultados de Mapas.
// Toque: abre el detalle. Mantener presionado: vista previa + menú nativo para navegar.
export const GasStationCard = memo<Props>(({ station }) => {
  const { handleNavigate } = useGasStationActions();
  const status = openStatus(station);

  return (
    <Link
      href={{
        pathname: '/gas-station-details',
        params: { stationId: station.id },
      }}
      asChild
    >
      <Link.Trigger>
        {/* Link asChild descarta `style` como función; `children` sí funciona. */}
        <Pressable>
          {({ pressed }) => (
            <View
              style={[
                cardStyle,
                {
                  backgroundColor: pressed
                    ? colors.cellHighlight
                    : colors.cellBackground,
                },
              ]}
            >
              <View style={iconCircleStyle}>
                <AppIcon name="fuel" size={18} color={colors.tint} />
              </View>

              <View style={{ flex: 1, gap: 2 }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'baseline',
                    gap: 8,
                  }}
                >
                  <Text
                    style={{
                      flex: 1,
                      fontSize: 17,
                      fontWeight: '600',
                      color: colors.label,
                    }}
                    numberOfLines={1}
                  >
                    {station.name}
                  </Text>
                  {station.distance != null && (
                    <Text
                      style={{
                        fontSize: 15,
                        color: colors.secondaryLabel,
                        fontVariant: ['tabular-nums'],
                      }}
                    >
                      {formatDistance(station.distance)}
                    </Text>
                  )}
                </View>
                <Text
                  style={{ fontSize: 15, color: colors.secondaryLabel }}
                  numberOfLines={1}
                >
                  {station.address}
                </Text>
                {/* MapKit no reporta horario ni rating: solo se muestran si existen. */}
                {(station.isOpen !== undefined || station.rating != null) && (
                  <Text
                    style={{ fontSize: 13, color: colors.secondaryLabel }}
                    numberOfLines={1}
                  >
                    {station.isOpen !== undefined && (
                      <Text style={{ color: status.color }}>
                        {status.label}
                      </Text>
                    )}
                    {station.isOpen !== undefined && station.rating != null
                      ? '  ·  '
                      : ''}
                    {station.rating != null && `★ ${station.rating.toFixed(1)}`}
                  </Text>
                )}
              </View>
            </View>
          )}
        </Pressable>
      </Link.Trigger>
      <Link.Preview />
      <Link.Menu
        title="Cómo llegar"
        icon="arrow.triangle.turn.up.right.diamond"
      >
        {NAVIGATION_APPS.map(({ app, label, icon }) => (
          <Link.MenuAction
            key={app}
            title={label}
            icon={icon}
            onPress={() => handleNavigate(station, app)}
          />
        ))}
      </Link.Menu>
    </Link>
  );
});
