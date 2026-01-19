import { useCallback, useEffect, useState } from 'react';
import { View, ScrollView, Text, ActivityIndicator, Pressable } from 'react-native';
import { useNavigation } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useLocationStore } from '~/stores/locationStore';
import { useLocationSearch } from '~/hooks/useLocationSearch';
import { LocationItem } from '~/components/location/LocationItem';
import { COLORS } from '~/config/constants';

export default function SearchIndex() {
  const navigation = useNavigation();
  const [searchText, setSearchText] = useState('');
  
  const { userLocation, address, setSelectedLocation } = useLocationStore();
  const {
    searchResults,
    isSearching,
    setSearchQuery,
    popularCities,
  } = useLocationSearch();

  useEffect(() => {
    navigation.setOptions({
      headerSearchBarOptions: {
        placeholder: 'Buscar ciudad...',
        onChangeText: (event: { nativeEvent: { text: string } }) => {
          const text = event.nativeEvent.text;
          setSearchText(text);
          setSearchQuery(text);
        },
      },
    });
  }, [navigation, setSearchQuery]);

  const handleSelectLocation = useCallback(
    (location: typeof searchResults[0]) => {
      setSelectedLocation({
        latitude: location.coordinates.latitude,
        longitude: location.coordinates.longitude,
        name: location.name,
        address: location.address,
      });
    },
    [setSelectedLocation],
  );

  const handleUseCurrentLocation = useCallback(() => {
    if (userLocation) {
      setSelectedLocation({
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        name: 'Mi ubicación actual',
        address: address || 'Ubicación actual',
      });
    }
  }, [userLocation, address, setSelectedLocation]);

  const hasSearchQuery = searchText.trim().length > 0;
  const showResults = hasSearchQuery ? searchResults : popularCities;

  if (!hasSearchQuery && !userLocation) {
    return (
      <View className="flex-1 bg-gray-50 items-center justify-center px-4">
        <View className="w-16 h-16 rounded-full items-center justify-center mb-4 bg-gray-200">
          <Ionicons name="search-outline" size={32} color="#9ca3af" />
        </View>
        <Text className="text-base text-gray-600 text-center">
          Busca una ciudad o ubicación
        </Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-gray-50" showsVerticalScrollIndicator={false}>
      {userLocation && (
        <View className="bg-white border-b border-gray-200">
          <View className="px-4 py-3 border-b border-gray-100">
            <Text className="text-sm font-semibold text-gray-700">Ubicación Actual</Text>
          </View>
          <Pressable
            onPress={handleUseCurrentLocation}
            className="flex-row items-center p-4 bg-primary-50 active:bg-primary-100"
          >
            <View
              className="w-10 h-10 rounded-xl items-center justify-center mr-3"
              style={{ backgroundColor: COLORS.PRIMARY }}
            >
              <Ionicons name="location" size={20} color="white" />
            </View>
            <View className="flex-1">
              <Text className="text-base font-semibold text-gray-900">
                Mi ubicación actual
              </Text>
              <Text className="text-sm text-gray-600" numberOfLines={1}>
                {address || 'Usar GPS actual'}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#9ca3af" />
          </Pressable>
        </View>
      )}

      <View className="bg-white">
        <View className="px-4 py-3 border-b border-gray-100">
          <Text className="text-sm font-semibold text-gray-700">
            {hasSearchQuery ? 'Resultados de búsqueda' : 'Ciudades populares'}
          </Text>
        </View>

        {isSearching ? (
          <View className="py-12 items-center">
            <ActivityIndicator size="large" color={COLORS.PRIMARY} />
          </View>
        ) : showResults.length > 0 ? (
          showResults.map((location) => (
            <LocationItem
              key={location.id}
              location={location}
              onPress={() => handleSelectLocation(location)}
              iconColor={hasSearchQuery ? '#9ca3af' : COLORS.PRIMARY}
              iconName={hasSearchQuery ? 'location-outline' : 'location'}
            />
          ))
        ) : (
          <View className="py-12 items-center">
            <Ionicons name="search-outline" size={48} color="#9ca3af" />
            <Text className="text-gray-500 text-center mt-4 text-sm">
              No se encontraron resultados
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}
