import 'global.css';

import { Stack, SplashScreen } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useEffect } from 'react';
import { useFonts } from 'expo-font';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { queryClient, asyncStoragePersister } from '~/api/useQueryClient';
import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: 'https://12b2f586e42aab82cbc2f5f344025096@o4509993871212544.ingest.us.sentry.io/4509993873571840',

  // Adds more context data to events (IP address, cookies, user, etc.)
  // For more information, visit: https://docs.sentry.io/platforms/react-native/data-management/data-collected/
  sendDefaultPii: true,

  // Configure Session Replay
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1,
  integrations: [
    Sentry.mobileReplayIntegration(),
    Sentry.feedbackIntegration(),
  ],

  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // spotlight: __DEV__,
});

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

export default Sentry.wrap(function RootLayout() {
  const [loaded, error] = useFonts({
    'Avenir-Black': require('../assets/fonts/Avenir-Black.otf'),
    'Avenir-Light': require('../assets/fonts/Avenir-Light.otf'),
    'Avenir-Medium': require('../assets/fonts/Avenir-Medium.otf'),
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
});

function RootLayoutNav() {
  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister: asyncStoragePersister }}
    >
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="settings"
            options={{
              title: 'Configuración',
              headerShown: true,
              presentation: 'formSheet',
            }}
          />
          <Stack.Screen name="+not-found" />
          <Stack.Screen
            name="gas-station-details"
            options={{
              title: 'Detalles de la gasolinera',
              headerShown: true,
              presentation: 'pageSheet',
            }}
          />
        </Stack>
      </GestureHandlerRootView>
    </PersistQueryClientProvider>
  );
}
