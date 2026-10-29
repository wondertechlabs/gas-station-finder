import type { FuelType, FuelTypeName } from './models';

// Precios estimados por marca: no hay fuente oficial de precios por estación.
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

export function estimateFuelPrices(brand: BrandName | undefined): FuelType[] {
  const basePrices: Record<FuelTypeName, number> = {
    regular: 35.5,
    super: 37.2,
    diesel: 33.8,
    glp: 28.5,
  };

  const brandMultiplier: Record<BrandName, number> = {
    'Puma Energy': 1.02,
    Shell: 1.05,
    Texaco: 1.03,
    Esso: 1.02,
    'DNP Petronic': 0.98,
    UNO: 0.97,
    Independiente: 0.95,
    Local: 0.96,
  };

  const multiplier = brand ? brandMultiplier[brand] : 1;

  const fuelTypes: { type: FuelTypeName; displayName: string }[] = [
    { type: 'regular', displayName: 'Regular' },
    { type: 'super', displayName: 'Super' },
    { type: 'diesel', displayName: 'Diesel' },
  ];

  return fuelTypes.map((fuel) => ({
    type: fuel.type,
    displayName: fuel.displayName,
    price: Math.round(basePrices[fuel.type] * multiplier * 100) / 100,
  }));
}
