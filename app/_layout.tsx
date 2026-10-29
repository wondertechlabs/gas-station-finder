import { Stack } from 'expo-router';
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from 'expo-router/react-navigation';
import { useColorScheme } from 'react-native';
import { defaultShouldDehydrateQuery } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import {
  QUERY_CACHE_BUSTER,
  queryClient,
  queryPersister,
} from '~/infrastructure/query/queryClient';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <PersistQueryClientProvider
        client={queryClient}
        persistOptions={{
          persister: queryPersister,
          buster: QUERY_CACHE_BUSTER,
          dehydrateOptions: {
            shouldDehydrateQuery: (query) =>
              defaultShouldDehydrateQuery(query) &&
              query.meta?.persist !== false,
          },
        }}
      >
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen
            name="gas-station-details"
            options={{
              headerShown: true,
              presentation: 'pageSheet',
              title: 'Gasolinera',
            }}
          />
          <Stack.Screen name="+not-found" options={{ headerShown: true }} />
        </Stack>
      </PersistQueryClientProvider>
    </ThemeProvider>
  );
}
