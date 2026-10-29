import type { GasStation } from '~/domain/gasStation/models';
import { colors } from '~/presentation/theme/colors';

export function formatDistance(meters: number): string {
  return meters < 1000
    ? `${Math.round(meters)} m`
    : `${(meters / 1000).toFixed(1)} km`;
}

export function openStatus(station: GasStation) {
  if (station.isOpen === undefined) {
    return { label: 'Horario no disponible', color: colors.tertiaryLabel };
  }
  return station.isOpen
    ? { label: 'Abierto', color: colors.green }
    : { label: 'Cerrado', color: colors.secondaryLabel };
}
