import { Stack } from 'expo-router';

export default function SearchLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: 'Buscar',
          headerSearchBarOptions: {
            placement: 'automatic',
            placeholder: 'Buscar ciudad...',
          },
        }}
      />
    </Stack>
  );
}
