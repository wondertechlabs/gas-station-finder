import React, { useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Modal,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocationStore } from '~/stores/locationStore';
import { LocationResult } from '~/types/location';
import { useLocationSearch } from '~/hooks/useLocationSearch';
import { COLORS } from '~/config/constants';

interface LocationSearchModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectLocation: (location: LocationResult) => void;
}

interface LocationItemProps {
  location: LocationResult;
  onPress: () => void;
  iconColor?: string;
  iconName?: keyof typeof Ionicons.glyphMap;
}

const LocationItem = React.memo<LocationItemProps>(
  ({ location, onPress, iconColor = COLORS.PRIMARY, iconName = 'location' }) => (
    <Pressable
      onPress={onPress}
      className="flex-row items-center p-4 bg-gray-50 rounded-xl mb-3 active:bg-gray-100"
    >
      <View
        className="w-10 h-10 rounded-lg items-center justify-center mr-3"
        style={{ backgroundColor: iconColor }}
      >
        <Ionicons name={iconName} size={18} color="white" />
      </View>
      <View className="flex-1">
        <Text className="text-base font-semibold text-gray-900">{location.name}</Text>
        <Text className="text-sm text-gray-600" numberOfLines={1}>
          {location.address}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color="#9ca3af" />
    </Pressable>
  ),
);

LocationItem.displayName = 'LocationItem';

export const LocationSearchModal = React.memo<LocationSearchModalProps>(
  ({ visible, onClose, onSelectLocation }) => {
    const { userLocation, address, setSelectedLocation } = useLocationStore();
    const {
      searchQuery,
      searchResults,
      isSearching,
      setSearchQuery,
      clearSearch,
      popularCities,
    } = useLocationSearch();

    const handleSelectLocation = useCallback(
      (location: LocationResult) => {
        setSelectedLocation({
          latitude: location.coordinates.latitude,
          longitude: location.coordinates.longitude,
          name: location.name,
          address: location.address,
        });
        onSelectLocation(location);
        clearSearch();
        onClose();
      },
      [setSelectedLocation, onSelectLocation, clearSearch, onClose],
    );

    const handleUseCurrentLocation = useCallback(() => {
      if (userLocation) {
        const location: LocationResult = {
          id: 'current',
          name: 'Mi ubicación actual',
          address: address || 'Ubicación actual',
          coordinates: userLocation,
        };
        handleSelectLocation(location);
      }
    }, [userLocation, address, handleSelectLocation]);

    const hasSearchQuery = searchQuery.trim().length > 0;
    const showResults = hasSearchQuery ? searchResults : popularCities;

    return (
      <Modal
        visible={visible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={onClose}
      >
        <View className="flex-1 bg-white">
          <View className="px-6 pt-12 pb-6 border-b border-gray-200">
            <View className="flex-row items-center justify-between mb-4">
              <View>
                <Text className="text-2xl font-bold text-gray-900">Seleccionar Ubicación</Text>
                <Text className="text-sm text-gray-500 mt-1">
                  Elige una ciudad o usa tu ubicación actual
                </Text>
              </View>
              <Pressable
                onPress={onClose}
                className="w-10 h-10 rounded-full items-center justify-center bg-gray-100 active:bg-gray-200"
              >
                <Ionicons name="close" size={22} color="#374151" />
              </Pressable>
            </View>

            <View className="flex-row items-center bg-gray-100 rounded-xl px-4 py-3">
              <Ionicons name="search" size={18} color="#9ca3af" />
              <TextInput
                className="flex-1 ml-3 text-gray-900 text-base"
                placeholder="Buscar ciudad..."
                placeholderTextColor="#9ca3af"
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoFocus
                autoCorrect={false}
              />
              {isSearching && <ActivityIndicator size="small" color={COLORS.PRIMARY} />}
            </View>
          </View>

          <ScrollView
            className="flex-1"
            contentContainerStyle={{ padding: 24, paddingTop: 16 }}
            showsVerticalScrollIndicator={false}
          >
            {userLocation && (
              <View className="mb-6">
                <Text className="text-sm font-semibold text-gray-700 mb-3">
                  Ubicación Actual
                </Text>
                <Pressable
                  onPress={handleUseCurrentLocation}
                  className="flex-row items-center p-4 bg-primary-50 rounded-xl border border-primary-200 active:bg-primary-100"
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

            <View className="mb-6">
              <Text className="text-sm font-semibold text-gray-700 mb-3">
                {hasSearchQuery ? 'Resultados de búsqueda' : 'Ciudades populares'}
              </Text>

              {hasSearchQuery && isSearching ? (
                <View className="py-8 items-center">
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
                <View className="py-8 items-center">
                  <Ionicons name="search-outline" size={48} color="#9ca3af" />
                  <Text className="text-gray-500 text-center mt-4 text-sm">
                    No se encontraron resultados
                  </Text>
                </View>
              )}
            </View>
          </ScrollView>
        </View>
      </Modal>
    );
  },
);

LocationSearchModal.displayName = 'LocationSearchModal';
