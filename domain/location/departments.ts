import type { Coordinates } from '~/domain/gasStation/models';
import { distanceInMeters } from '~/domain/geo/distance';
import { NICARAGUA_DEPARTMENTS } from './models';

// Los 15 departamentos y 2 regiones autónomas, con el mismo id que
// NICARAGUA_DEPARTMENTS (que guarda las coordenadas de cada cabecera).
export const DEPARTMENTS = [
  { id: 'boaco', name: 'Boaco' },
  { id: 'carazo', name: 'Carazo' },
  { id: 'chinandega', name: 'Chinandega' },
  { id: 'chontales', name: 'Chontales' },
  { id: 'costa-caribe-norte', name: 'Costa Caribe Norte' },
  { id: 'costa-caribe-sur', name: 'Costa Caribe Sur' },
  { id: 'esteli', name: 'Estelí' },
  { id: 'granada', name: 'Granada' },
  { id: 'jinotega', name: 'Jinotega' },
  { id: 'leon', name: 'León' },
  { id: 'madriz', name: 'Madriz' },
  { id: 'managua', name: 'Managua' },
  { id: 'masaya', name: 'Masaya' },
  { id: 'matagalpa', name: 'Matagalpa' },
  { id: 'nueva-segovia', name: 'Nueva Segovia' },
  { id: 'rio-san-juan', name: 'Río San Juan' },
  { id: 'rivas', name: 'Rivas' },
] as const;

export type DepartmentId = (typeof DEPARTMENTS)[number]['id'];

// Marcas de acento que deja `normalize('NFD')` (U+0300–U+036F).
const DIACRITICS = new RegExp('[\\u0300-\\u036f]', 'g');

const normalize = (text: string) =>
  text.normalize('NFD').replace(DIACRITICS, '').toLowerCase().trim();

/**
 * Convierte el nombre que da el sistema (depende del idioma del dispositivo:
 * "Leon", "Southern Atlantic Region", "Región Autónoma de la Costa Caribe Norte")
 * en un departamento.
 */
export function departmentFromName(raw?: string): DepartmentId | undefined {
  if (!raw) return undefined;
  const name = normalize(raw);

  if (/atlantic|atlantico|caribe|caribbean|raan|raas|racc/.test(name)) {
    if (/north|norte|raan|raccn/.test(name)) return 'costa-caribe-norte';
    if (/south|sur|raas|raccs/.test(name)) return 'costa-caribe-sur';
  }

  const exact = DEPARTMENTS.find((d) => normalize(d.name) === name);
  if (exact) return exact.id;
  // "Departamento de Matagalpa" y similares.
  return DEPARTMENTS.find((d) => name.includes(normalize(d.name)))?.id;
}

/** Respaldo cuando el sistema no da el departamento: la cabecera más cercana. */
export function nearestDepartment(coordinates: Coordinates): DepartmentId {
  let nearest = NICARAGUA_DEPARTMENTS[0];
  let best = Infinity;
  for (const capital of NICARAGUA_DEPARTMENTS) {
    const distance = distanceInMeters(coordinates, capital.coordinates);
    if (distance < best) {
      best = distance;
      nearest = capital;
    }
  }
  return nearest.id as DepartmentId;
}

export function departmentName(id: DepartmentId): string {
  return DEPARTMENTS.find((d) => d.id === id)!.name;
}
