import { useState, useCallback, useMemo } from 'react';
import { GasStation } from '~/types/gasStation';

export const useGasStationFilters = (gasStations: GasStation[]) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredStations = useMemo(() => {
    if (searchQuery.trim() === '') {
      return gasStations;
    }

    return gasStations.filter(
      (station) =>
        station.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        station.brand?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        station.address.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [gasStations, searchQuery]);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const hasActiveFilters = useMemo(() => {
    return searchQuery.trim() !== '';
  }, [searchQuery]);

  return {
    filteredStations,
    searchQuery,
    handleSearch,
    hasActiveFilters,
  };
};
