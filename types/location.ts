export interface LocationResult {
  id: string;
  name: string;
  address: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

export const NICARAGUA_DEPARTMENTS: LocationResult[] = [
  {
    id: 'managua',
    name: 'Managua',
    address: 'Managua, Nicaragua',
    coordinates: { latitude: 12.1364, longitude: -86.2514 }
  },
  {
    id: 'leon',
    name: 'León',
    address: 'León, Nicaragua',
    coordinates: { latitude: 12.4346, longitude: -86.8784 }
  },
  {
    id: 'granada',
    name: 'Granada',
    address: 'Granada, Nicaragua',
    coordinates: { latitude: 11.9345, longitude: -85.9560 }
  },
  {
    id: 'masaya',
    name: 'Masaya',
    address: 'Masaya, Nicaragua',
    coordinates: { latitude: 11.9742, longitude: -86.0958 }
  },
  {
    id: 'matagalpa',
    name: 'Matagalpa',
    address: 'Matagalpa, Nicaragua',
    coordinates: { latitude: 12.9266, longitude: -85.9175 }
  },
  {
    id: 'esteli',
    name: 'Estelí',
    address: 'Estelí, Nicaragua',
    coordinates: { latitude: 13.0929, longitude: -86.3540 }
  },
  {
    id: 'jinotega',
    name: 'Jinotega',
    address: 'Jinotega, Nicaragua',
    coordinates: { latitude: 13.0907, longitude: -85.9994 }
  },
  {
    id: 'chinandega',
    name: 'Chinandega',
    address: 'Chinandega, Nicaragua',
    coordinates: { latitude: 12.6244, longitude: -87.1306 }
  },
  // Departamentos adicionales
  {
    id: 'boaco',
    name: 'Boaco',
    address: 'Boaco, Nicaragua',
    coordinates: { latitude: 12.4667, longitude: -85.6667 }
  },
  {
    id: 'carazo',
    name: 'Jinotepe',
    address: 'Jinotepe, Carazo, Nicaragua',
    coordinates: { latitude: 11.8500, longitude: -86.2000 }
  },
  {
    id: 'chontales',
    name: 'Juigalpa',
    address: 'Juigalpa, Chontales, Nicaragua',
    coordinates: { latitude: 12.1000, longitude: -85.3667 }
  },
  {
    id: 'madriz',
    name: 'Somoto',
    address: 'Somoto, Madriz, Nicaragua',
    coordinates: { latitude: 13.4833, longitude: -86.5833 }
  },
  {
    id: 'nueva-segovia',
    name: 'Ocotal',
    address: 'Ocotal, Nueva Segovia, Nicaragua',
    coordinates: { latitude: 13.6333, longitude: -86.4833 }
  },
  {
    id: 'rio-san-juan',
    name: 'San Carlos',
    address: 'San Carlos, Río San Juan, Nicaragua',
    coordinates: { latitude: 11.1167, longitude: -84.7833 }
  },
  {
    id: 'rivas',
    name: 'Rivas',
    address: 'Rivas, Nicaragua',
    coordinates: { latitude: 11.4333, longitude: -85.8333 }
  },
  // Regiones Autónomas
  {
    id: 'costa-caribe-norte',
    name: 'Puerto Cabezas',
    address: 'Puerto Cabezas, Costa Caribe Norte, Nicaragua',
    coordinates: { latitude: 14.0333, longitude: -83.3833 }
  },
  {
    id: 'costa-caribe-sur',
    name: 'Bluefields',
    address: 'Bluefields, Costa Caribe Sur, Nicaragua',
    coordinates: { latitude: 12.0167, longitude: -83.7667 }
  }
];
