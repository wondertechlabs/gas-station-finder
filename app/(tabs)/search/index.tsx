import { useCallback, useState } from 'react';
import type { ColorValue } from 'react-native';
import { ActivityIndicator, Text, View } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { router, Stack } from 'expo-router';
import type { LocationResult } from '~/domain/location/models';
import { LocationItem } from '~/presentation/components/location/LocationItem';
import {
  GroupedCell,
  GroupedHeader,
} from '~/presentation/components/ui/GroupedSection';
import type { AppIconName } from '~/presentation/components/ui/AppIcon';
import { useLocationSearch } from '~/presentation/hooks/useLocationSearch';
import { useReverseGeocode } from '~/presentation/hooks/useReverseGeocode';
import { useLocationStore } from '~/presentation/stores/locationStore';
import { colors } from '~/presentation/theme/colors';

type SearchItem =
  | { type: 'header'; key: string; title: string; first: boolean }
  | {
      type: 'location';
      key: string;
      location: LocationResult;
      iconName: AppIconName;
      iconColor: ColorValue;
      first: boolean;
      last: boolean;
      onPress: () => void;
    }
  | { type: 'status'; key: string; text?: string };

export default function SearchIndex() {
  const [searchText, setSearchText] = useState('');

  const userLocation = useLocationStore((state) => state.userLocation);
  const setSelectedLocation = useLocationStore(
    (state) => state.setSelectedLocation,
  );
  const { searchResults, isSearching, setSearchQuery, popularCities } =
    useLocationSearch();
  const { address, isLoading: isLoadingAddress } =
    useReverseGeocode(userLocation);

  const handleChangeText = useCallback(
    (text: string) => {
      setSearchText(text);
      setSearchQuery(text);
    },
    [setSearchQuery],
  );

  const handleSelectLocation = useCallback(
    (location: LocationResult) => {
      setSelectedLocation({
        latitude: location.coordinates.latitude,
        longitude: location.coordinates.longitude,
        name: location.name,
        address: location.address,
      });
      router.navigate('/');
    },
    [setSelectedLocation],
  );

  // Sin selección manual, el mapa sigue la ubicación real del usuario.
  const handleUseCurrentLocation = useCallback(() => {
    setSelectedLocation(null);
    router.navigate('/');
  }, [setSelectedLocation]);

  const hasSearchQuery = searchText.trim().length > 0;
  const results = hasSearchQuery ? searchResults : popularCities;

  const items: SearchItem[] = [];
  if (userLocation && !hasSearchQuery) {
    items.push(
      {
        type: 'header',
        key: 'h-current',
        title: 'Ubicación actual',
        first: true,
      },
      {
        type: 'location',
        key: 'current',
        location: {
          id: 'current',
          name:
            isLoadingAddress || !address ? 'Obteniendo dirección...' : address,
          address: `${userLocation.latitude.toFixed(4)}, ${userLocation.longitude.toFixed(4)}`,
          coordinates: userLocation,
        },
        iconName: 'location',
        iconColor: colors.tint,
        first: true,
        last: true,
        onPress: handleUseCurrentLocation,
      },
    );
  }
  items.push({
    type: 'header',
    key: 'h-results',
    title: hasSearchQuery ? 'Resultados' : 'Ciudades populares',
    first: items.length === 0,
  });
  if (isSearching) {
    items.push({ type: 'status', key: 'loading' });
  } else if (results.length === 0) {
    items.push({
      type: 'status',
      key: 'empty',
      text: `Sin resultados para “${searchText.trim()}”`,
    });
  } else {
    results.forEach((location, index) =>
      items.push({
        type: 'location',
        key: location.id,
        location,
        iconName: hasSearchQuery ? 'pin' : 'location',
        iconColor: hasSearchQuery ? colors.secondaryLabel : colors.tint,
        first: index === 0,
        last: index === results.length - 1,
        onPress: () => handleSelectLocation(location),
      }),
    );
  }

  return (
    <>
      <FlashList
        data={items}
        keyExtractor={(item) => item.key}
        getItemType={(item) => item.type}
        renderItem={({ item }) => <SearchRow item={item} />}
        contentInsetAdjustmentBehavior="automatic"
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        style={{ backgroundColor: colors.groupedBackground }}
        contentContainerStyle={{ padding: 16 }}
      />

      <Stack.SearchBar
        placeholder="Buscar ciudad..."
        onChangeText={(event) => handleChangeText(event.nativeEvent.text)}
        onCancelButtonPress={() => handleChangeText('')}
      />
    </>
  );
}

function SearchRow({ item }: { item: SearchItem }) {
  switch (item.type) {
    case 'header':
      return <GroupedHeader title={item.title} first={item.first} />;
    case 'location':
      return (
        <GroupedCell first={item.first} last={item.last}>
          <LocationItem
            location={item.location}
            iconName={item.iconName}
            iconColor={item.iconColor}
            onPress={item.onPress}
            last={item.last}
          />
        </GroupedCell>
      );
    case 'status':
      return (
        <GroupedCell first last>
          <View style={{ padding: 16, alignItems: 'center' }}>
            {item.text ? (
              <Text
                style={{
                  fontSize: 17,
                  color: colors.secondaryLabel,
                  textAlign: 'center',
                }}
              >
                {item.text}
              </Text>
            ) : (
              <ActivityIndicator />
            )}
          </View>
        </GroupedCell>
      );
  }
}
