import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SearchBarProps {
  onSearch: (query: string) => void;
  onFilterPress: () => void;
  placeholder?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  onFilterPress,
  placeholder = 'Buscar gasolineras...',
}) => {
  const [query, setQuery] = useState('');

  const handleSearch = (text: string) => {
    setQuery(text);
    onSearch(text);
  };

  const clearSearch = () => {
    setQuery('');
    onSearch('');
  };

  return (
    <View className="flex-row items-center bg-white rounded-2xl shadow-sm border border-gray-200 px-4 py-3 mx-4 mb-4">
      <View className="flex-row items-center flex-1">
        <Ionicons name="search" size={20} color="#6b7280" />
        <TextInput
          className="flex-1 ml-3 text-gray-900 text-base"
          placeholder={placeholder}
          placeholderTextColor="#9ca3af"
          value={query}
          onChangeText={handleSearch}
          returnKeyType="search"
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={clearSearch} className="ml-2">
            <Ionicons name="close-circle" size={20} color="#9ca3af" />
          </TouchableOpacity>
        )}
      </View>

      <TouchableOpacity
        onPress={onFilterPress}
        className="ml-3 p-2 bg-gray-100 rounded-full"
      >
        <Ionicons name="options" size={20} color="#6b7280" />
      </TouchableOpacity>
    </View>
  );
};
