// Marca deducida del nombre de la estación.
export type BrandName =
  | 'Puma Energy'
  | 'DNP Petronic'
  | 'UNO'
  | 'Shell'
  | 'Texaco'
  | 'Esso'
  | 'Independiente'
  | 'Local';

export function determineBrand(name: string): BrandName | undefined {
  const nameLower = name.toLowerCase();

  if (nameLower.includes('puma')) return 'Puma Energy';
  if (nameLower.includes('petronic') || nameLower.includes('dnp'))
    return 'DNP Petronic';
  if (nameLower.includes('uno')) return 'UNO';
  if (nameLower.includes('shell')) return 'Shell';
  if (nameLower.includes('texaco')) return 'Texaco';
  if (nameLower.includes('esso') || nameLower.includes('exxon')) return 'Esso';
  if (
    nameLower.includes('bandera blanca') ||
    nameLower.includes('independiente')
  )
    return 'Independiente';
  if (nameLower.includes('local') || nameLower.includes('privada'))
    return 'Local';

  return undefined;
}
