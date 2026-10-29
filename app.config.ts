import type { ConfigContext, ExpoConfig } from 'expo/config';

// expo-maps usa Google Maps en Android, que necesita su propia API key
// (restringida al paquete Android y a la huella SHA-1 de la app).
export default ({ config }: ConfigContext): ExpoConfig => ({
  ...(config as ExpoConfig),
  android: {
    ...config.android,
    config: {
      ...config.android?.config,
      googleMaps: {
        apiKey: process.env.GOOGLE_MAPS_ANDROID_API_KEY,
      },
    },
  },
});
