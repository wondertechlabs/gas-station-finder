import type { ReactNode } from 'react';
import { Text, View } from 'react-native';
import { colors } from '~/presentation/theme/colors';

// Piezas de una lista "inset grouped" (como Ajustes de iOS) pensadas para
// renderizarse fila a fila dentro de una FlashList.

const RADIUS = 12;

export function GroupedHeader({
  title,
  first,
}: {
  title: string;
  first?: boolean;
}) {
  return (
    <Text
      style={{
        paddingTop: first ? 0 : 24,
        paddingBottom: 6,
        paddingHorizontal: 16,
        fontSize: 13,
        color: colors.secondaryLabel,
        textTransform: 'uppercase',
      }}
    >
      {title}
    </Text>
  );
}

export function GroupedFooter({ text }: { text: string }) {
  return (
    <Text
      style={{
        paddingTop: 6,
        paddingHorizontal: 16,
        fontSize: 13,
        color: colors.secondaryLabel,
      }}
    >
      {text}
    </Text>
  );
}

/** Fondo de celda: redondea solo las esquinas de la primera y última fila. */
export function GroupedCell({
  first,
  last,
  children,
}: {
  first?: boolean;
  last?: boolean;
  children: ReactNode;
}) {
  return (
    <View
      style={{
        overflow: 'hidden',
        borderCurve: 'continuous',
        borderTopLeftRadius: first ? RADIUS : 0,
        borderTopRightRadius: first ? RADIUS : 0,
        borderBottomLeftRadius: last ? RADIUS : 0,
        borderBottomRightRadius: last ? RADIUS : 0,
        backgroundColor: colors.cellBackground,
      }}
    >
      {children}
    </View>
  );
}

/** Contenido estándar de una fila: 44pt mínimo y separador salvo en la última. */
export function GroupedRow({
  last,
  children,
}: {
  last?: boolean;
  children: ReactNode;
}) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        minHeight: 44,
        paddingVertical: 11,
        paddingHorizontal: 16,
        borderBottomWidth: last ? 0 : 0.5,
        borderBottomColor: colors.separator,
      }}
    >
      {children}
    </View>
  );
}
