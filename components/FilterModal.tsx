import React from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApplyFilters: (filters: FilterOptions) => void;
  currentFilters: FilterOptions;
}

export interface FilterOptions {
  brand: string[];
  amenities: string[];
  isOpen: boolean | null;
  is24Hours: boolean | null;
  minRating: number;
}

const BRANDS = ['Shell', 'Petronic', 'UNO Gas', 'Puma', 'Texaco', 'Esso'];
const AMENITIES = ['Tienda', 'Servicios', 'ATM', 'Lavado'];

export const FilterModal: React.FC<FilterModalProps> = ({
  visible,
  onClose,
  onApplyFilters,
  currentFilters,
}) => {
  const [filters, setFilters] = React.useState<FilterOptions>(currentFilters);

  const handleBrandToggle = (brand: string) => {
    setFilters((prev) => ({
      ...prev,
      brand: prev.brand.includes(brand)
        ? prev.brand.filter((b) => b !== brand)
        : [...prev.brand, brand],
    }));
  };

  const handleAmenityToggle = (amenity: string) => {
    setFilters((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  const handleStatusToggle = (status: 'isOpen' | 'is24Hours') => {
    setFilters((prev) => ({
      ...prev,
      [status]:
        prev[status] === null ? true : prev[status] === true ? false : null,
    }));
  };

  const handleRatingChange = (rating: number) => {
    setFilters((prev) => ({
      ...prev,
      minRating: prev.minRating === rating ? 0 : rating,
    }));
  };

  const handleApply = () => {
    onApplyFilters(filters);
    onClose();
  };

  const handleReset = () => {
    const resetFilters: FilterOptions = {
      brand: [],
      amenities: [],
      isOpen: null,
      is24Hours: null,
      minRating: 0,
    };
    setFilters(resetFilters);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View className="flex-1 bg-gray-50">
        {/* Header */}
        <View className="bg-white px-6 py-4 border-b border-gray-200">
          <View className="flex-row items-center justify-between">
            <Text className="text-xl font-bold text-gray-900">Filtros</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#6b7280" />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView className="flex-1 px-6 py-4">
          {/* Brand Filter */}
          <View className="mb-6">
            <Text className="text-lg font-semibold text-gray-900 mb-3">
              Marca
            </Text>
            <View className="flex-row flex-wrap">
              {BRANDS.map((brand) => (
                <TouchableOpacity
                  key={brand}
                  onPress={() => handleBrandToggle(brand)}
                  className={`mr-2 mb-2 px-4 py-2 rounded-full border ${
                    filters.brand.includes(brand)
                      ? 'bg-green-500 border-green-500'
                      : 'bg-white border-gray-300'
                  }`}
                >
                  <Text
                    className={`text-sm font-medium ${
                      filters.brand.includes(brand)
                        ? 'text-white'
                        : 'text-gray-700'
                    }`}
                  >
                    {brand}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Status Filter */}
          <View className="mb-6">
            <Text className="text-lg font-semibold text-gray-900 mb-3">
              Estado
            </Text>
            <View className="space-y-3">
              <TouchableOpacity
                onPress={() => handleStatusToggle('isOpen')}
                className="flex-row items-center justify-between bg-white p-4 rounded-xl border border-gray-200"
              >
                <Text className="text-base text-gray-900">Solo abiertas</Text>
                <View
                  className={`w-6 h-6 rounded-full border-2 items-center justify-center ${
                    filters.isOpen === true
                      ? 'bg-green-500 border-green-500'
                      : 'border-gray-300'
                  }`}
                >
                  {filters.isOpen === true && (
                    <Ionicons name="checkmark" size={16} color="white" />
                  )}
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => handleStatusToggle('is24Hours')}
                className="flex-row items-center justify-between bg-white p-4 rounded-xl border border-gray-200"
              >
                <Text className="text-base text-gray-900">24 horas</Text>
                <View
                  className={`w-6 h-6 rounded-full border-2 items-center justify-center ${
                    filters.is24Hours === true
                      ? 'bg-green-500 border-green-500'
                      : 'border-gray-300'
                  }`}
                >
                  {filters.is24Hours === true && (
                    <Ionicons name="checkmark" size={16} color="white" />
                  )}
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* Amenities Filter */}
          <View className="mb-6">
            <Text className="text-lg font-semibold text-gray-900 mb-3">
              Servicios
            </Text>
            <View className="flex-row flex-wrap">
              {AMENITIES.map((amenity) => (
                <TouchableOpacity
                  key={amenity}
                  onPress={() => handleAmenityToggle(amenity)}
                  className={`mr-2 mb-2 px-4 py-2 rounded-full border ${
                    filters.amenities.includes(amenity)
                      ? 'bg-blue-500 border-blue-500'
                      : 'bg-white border-gray-300'
                  }`}
                >
                  <Text
                    className={`text-sm font-medium ${
                      filters.amenities.includes(amenity)
                        ? 'text-white'
                        : 'text-gray-700'
                    }`}
                  >
                    {amenity}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Rating Filter */}
          <View className="mb-6">
            <Text className="text-lg font-semibold text-gray-900 mb-3">
              Calificación mínima
            </Text>
            <View className="flex-row space-x-2">
              {[1, 2, 3, 4, 5].map((rating) => (
                <TouchableOpacity
                  key={rating}
                  onPress={() => handleRatingChange(rating)}
                  className={`w-12 h-12 rounded-full items-center justify-center ${
                    filters.minRating >= rating
                      ? 'bg-yellow-400'
                      : 'bg-gray-200'
                  }`}
                >
                  <Text
                    className={`text-lg font-bold ${
                      filters.minRating >= rating
                        ? 'text-white'
                        : 'text-gray-600'
                    }`}
                  >
                    {rating}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>

        {/* Footer */}
        <View className="bg-white px-6 py-4 border-t border-gray-200">
          <View className="flex-row space-x-3">
            <TouchableOpacity
              onPress={handleReset}
              className="flex-1 bg-gray-100 py-3 rounded-xl items-center"
            >
              <Text className="text-base font-medium text-gray-700">
                Limpiar
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleApply}
              className="flex-1 bg-green-500 py-3 rounded-xl items-center"
            >
              <Text className="text-base font-medium text-white">Aplicar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};
