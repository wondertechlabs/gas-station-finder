# Gas Station Finder - Managua

Una aplicación móvil desarrollada con React Native y Expo para encontrar gasolineras en la ciudad de Managua, Nicaragua.

## 🚀 Características

- **Mapa interactivo** con markers de gasolineras
- **Búsqueda en tiempo real** por nombre, marca o dirección
- **Filtros avanzados** por marca, servicios, estado y calificación
- **Información detallada** de cada gasolinera
- **Navegación integrada** con Apple Maps
- **Llamadas directas** a las gasolineras
- **Diseño moderno** con NativeWind (Tailwind CSS)

## 🛠️ Tecnologías

- **React Native** con Expo
- **TypeScript** para type safety
- **NativeWind** para estilos
- **Expo Maps** para mapas
- **Zustand** para estado global
- **TanStack Query** para manejo de datos

## 📱 Funcionalidades

### Mapa Principal
- Vista de mapa centrada en Managua
- Markers personalizados para cada gasolinera
- Información de estado (abierto/cerrado, 24 horas)
- Contador de gasolineras disponibles

### Búsqueda y Filtros
- Búsqueda por texto en tiempo real
- Filtros por marca (Shell, Petronic, UNO Gas, etc.)
- Filtros por servicios (Tienda, ATM, Lavado, etc.)
- Filtros por estado (abierto, 24 horas)
- Filtros por calificación mínima

### Detalles de Gasolinera
- Información completa de la gasolinera
- Precios de combustible actualizados
- Servicios disponibles
- Calificación y número de teléfono
- Botones de acción (direcciones, llamar)

## 🚀 Instalación

1. Clona el repositorio:
```bash
git clone https://github.com/tu-usuario/gas-station-finder.git
cd gas-station-finder
```

2. Instala las dependencias:
```bash
bun install
```

3. Inicia el servidor de desarrollo:
```bash
bun start
```

4. Ejecuta en dispositivo:
```bash
# iOS
bun run ios

# Android
bun run android
```

## 📁 Estructura del Proyecto

```
├── app/                    # Pantallas con Expo Router
│   ├── (tabs)/            # Navegación por tabs
│   │   ├── index.tsx      # Pantalla principal del mapa
│   │   ├── list.tsx       # Lista de gasolineras
│   │   └── filters.tsx    # Pantalla de filtros
├── components/            # Componentes reutilizables
│   ├── GasStationCard.tsx # Tarjeta de gasolinera
│   ├── SearchBar.tsx      # Barra de búsqueda
│   └── FilterModal.tsx    # Modal de filtros
├── hooks/                 # Hooks personalizados
│   └── useGasStationFilters.ts
├── services/              # Servicios de datos
│   └── gasStationService.ts
├── types/                 # Definiciones de tipos
│   └── gasStation.ts
└── assets/               # Recursos estáticos
```

## 🎨 Diseño

La aplicación utiliza un diseño moderno y limpio con:
- **Colores principales**: Verde para gasolineras, azul para acciones
- **Tipografía**: Sistema nativo con pesos semibold y bold
- **Espaciado**: Consistente usando Tailwind CSS
- **Componentes**: Reutilizables y accesibles

## 📊 Datos

Actualmente la aplicación utiliza datos mock de gasolineras en Managua, incluyendo:
- 12 gasolineras distribuidas por la ciudad
- Información realista de precios de combustible
- Servicios y amenidades disponibles
- Horarios de operación

## 🔮 Próximas Características

- [ ] Integración con API real de gasolineras
- [ ] Precios actualizados en tiempo real
- [ ] Notificaciones de precios bajos
- [ ] Historial de gasolineras visitadas
- [ ] Modo offline
- [ ] Integración con Google Maps

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 👨‍💻 Autor

Desarrollado con ❤️ para la comunidad de Managua, Nicaragua.
