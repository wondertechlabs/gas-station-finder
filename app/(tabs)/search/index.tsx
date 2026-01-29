import { useCallback, useEffect, useState, useMemo } from 'react';
import {
  View,
  ScrollView,
  Text,
  ActivityIndicator,
  Pressable,
} from 'react-native';
import { useNavigation, router } from 'expo-router';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '~/shared/constants';
import { LocationItem } from '~/presentation/components/location/LocationItem';
import { useLocationSearch } from '~/presentation/hooks/useLocationSearch';
import { useLocationStore } from '~/presentation/stores/locationStore';

export default function SearchIndex() {
  const navigation = useNavigation();
  const [searchText, setSearchText] = useState('');
  const [currentAddress, setCurrentAddress] = useState<string | null>(null);
  const [isLoadingAddress, setIsLoadingAddress] = useState(false);

  const { userLocation, address, setSelectedLocation } = useLocationStore();
  const { searchResults, isSearching, setSearchQuery, popularCities } =
    useLocationSearch();

  const displayAddress = useMemo(() => {
    if (currentAddress) return currentAddress;
    if (address && address !== 'Ubicación actual') return address;
    if (userLocation) {
      return `${userLocation.latitude.toFixed(4)}, ${userLocation.longitude.toFixed(4)}`;
    }
    return 'Obteniendo ubicación...';
  }, [currentAddress, address, userLocation]);

  useEffect(() => {
    const getAddressFromLocation = async () => {
      if (!userLocation) {
        setCurrentAddress(null);
        return;
      }

      // Si ya tenemos una dirección válida del store, usarla
      if (address && address !== 'Ubicación actual') {
        setCurrentAddress(address);
        return;
      }

      // Intentar hacer reverse geocoding
      setIsLoadingAddress(true);
      try {
        const reverseGeocode = await Location.reverseGeocodeAsync({
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
        });

        if (reverseGeocode.length > 0) {
          const result = reverseGeocode[0];
          const addressParts: string[] = [];

          if (result.street) addressParts.push(result.street);
          if (result.district) addressParts.push(result.district);
          if (result.city) addressParts.push(result.city);
          if (result.region) addressParts.push(result.region);

          const fullAddress =
            addressParts.length > 0
              ? addressParts.join(', ')
              : `${userLocation.latitude.toFixed(4)}, ${userLocation.longitude.toFixed(4)}`;

          setCurrentAddress(fullAddress);
        } else {
          setCurrentAddress(
            `${userLocation.latitude.toFixed(4)}, ${userLocation.longitude.toFixed(4)}`,
          );
        }
      } catch {
        setCurrentAddress(
          `${userLocation.latitude.toFixed(4)}, ${userLocation.longitude.toFixed(4)}`,
        );
      } finally {
        setIsLoadingAddress(false);
      }
    };

    getAddressFromLocation();
  }, [userLocation, address]);

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
    (location: (typeof searchResults)[0]) => {
      setSelectedLocation({
        latitude: location.coordinates.latitude,
        longitude: location.coordinates.longitude,
        name: location.name,
        address: location.address,
      });
      router.push('/(tabs)');
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
      router.push('/(tabs)');
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
    <ScrollView
      className="flex-1 bg-gray-50"
      showsVerticalScrollIndicator={false}
    >
      {userLocation && (
        <View className="bg-white border-b border-gray-200">
          <View className="px-4 py-3 border-b border-gray-100">
            <Text className="text-sm font-semibold text-gray-700">
              Ubicación actual
            </Text>
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
              <Text
                className="text-base font-semibold text-gray-900"
                numberOfLines={1}
              >
                {isLoadingAddress ? 'Obteniendo dirección...' : displayAddress}
              </Text>
              {userLocation && (
                <Text
                  className="text-sm text-gray-500 mt-0.5"
                  numberOfLines={1}
                >
                  {userLocation.latitude.toFixed(4)},{' '}
                  {userLocation.longitude.toFixed(4)}
                </Text>
              )}
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
