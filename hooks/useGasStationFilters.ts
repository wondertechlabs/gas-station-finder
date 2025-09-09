import { useState, useCallback, useMemo } from 'react';
import { GasStation } from '~/types/gasStation';
import { FilterOptions } from '~/components/FilterModal';

export const useGasStationFilters = (gasStations: GasStation[]) => {
  const [filters, setFilters] = useState<FilterOptions>({
    brand: [],
    amenities: [],
    isOpen: null,
    is24Hours: null,
    minRating: 0,
  });

  const [searchQuery, setSearchQuery] = useState('');

  const filteredStations = useMemo(() => {
    let filtered = gasStations;

    // Apply search filter
    if (searchQuery.trim() !== '') {
      filtered = filtered.filter(
        (station) =>
          station.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          station.brand?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          station.address.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    // Apply brand filter
    if (filters.brand.length > 0) {
      filtered = filtered.filter(
        (station) => station.brand && filters.brand.includes(station.brand),
      );
    }

    // Apply amenities filter
    if (filters.amenities.length > 0) {
      filtered = filtered.filter((station) =>
        filters.amenities.every((amenity) =>
          station.amenities.includes(amenity),
        ),
      );
    }

    // Apply status filters
    if (filters.isOpen !== null) {
      filtered = filtered.filter(
        (station) => station.isOpen === filters.isOpen,
      );
    }

    if (filters.is24Hours !== null) {
      filtered = filtered.filter(
        (station) => station.is24Hours === filters.is24Hours,
      );
    }

    // Apply rating filter
    if (filters.minRating > 0) {
      filtered = filtered.filter(
        (station) => station.rating && station.rating >= filters.minRating,
      );
    }

    return filtered;
  }, [gasStations, filters, searchQuery]);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleApplyFilters = useCallback((newFilters: FilterOptions) => {
    setFilters(newFilters);
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({
      brand: [],
      amenities: [],
      isOpen: null,
      is24Hours: null,
      minRating: 0,
    });
    setSearchQuery('');
  }, []);

  const hasActiveFilters = useMemo(() => {
    return (
      filters.brand.length > 0 ||
      filters.amenities.length > 0 ||
      filters.isOpen !== null ||
      filters.is24Hours !== null ||
      filters.minRating > 0 ||
      searchQuery.trim() !== ''
    );
  }, [filters, searchQuery]);

  return {
    filteredStations,
    filters,
    searchQuery,
    handleSearch,
    handleApplyFilters,
    resetFilters,
    hasActiveFilters,
  };
};
