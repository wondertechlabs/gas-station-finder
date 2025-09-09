// Configuración específica para Managua, Nicaragua

export const MANAGUA_CONFIG = {
  // Coordenadas del centro de Managua
  center: {
    latitude: 12.1364,
    longitude: -86.2514,
  },

  // Límites de la ciudad para validación
  bounds: {
    north: 12.2,
    south: 12.0,
    east: -86.1,
    west: -86.3,
  },

  // Zoom por defecto del mapa
  defaultZoom: 13,

  // Marcas de gasolina principales en Nicaragua
  brands: ['Shell', 'Petronic', 'UNO Gas', 'Puma', 'Texaco', 'Esso'] as const,

  // Servicios comunes en gasolineras
  amenities: ['Tienda', 'Servicios', 'ATM', 'Lavado'] as const,

  // Tipos de combustible
  fuelTypes: [
    { type: 'regular', displayName: 'Regular (87)' },
    { type: 'super', displayName: 'Súper (91)' },
    { type: 'diesel', displayName: 'Diesel' },
    { type: 'glp', displayName: 'GLP' },
  ] as const,

  // Precios promedio de referencia (en córdobas)
  averagePrices: {
    regular: 35.5,
    super: 37.8,
    diesel: 33.2,
    glp: 25.0,
  },
} as const;

export type ManaguaBrand = (typeof MANAGUA_CONFIG.brands)[number];
export type ManaguaAmenity = (typeof MANAGUA_CONFIG.amenities)[number];
export type ManaguaFuelType = (typeof MANAGUA_CONFIG.fuelTypes)[number];
