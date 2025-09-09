import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { GasStationService } from '~/services/gasStationService';
import { useGasStationStore } from '~/stores/gasStationStore';
import { useLocationStore } from '~/stores/locationStore';

export const useGasStations = () => {
  const { userLocation } = useLocationStore();
  const { searchQuery } = useGasStationStore();

  const {
    data: gasStations = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['gasStations', userLocation?.latitude, userLocation?.longitude],
    queryFn: async () => {
      if (!userLocation) {
        throw new Error('Ubicación no disponible');
      }
      return GasStationService.findNearby(
        userLocation.latitude,
        userLocation.longitude,
        10000,
      );
    },
    enabled: !!userLocation,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  const filteredStations = useMemo(() => {
    if (!searchQuery.trim()) {
      return gasStations;
    }

    return gasStations.filter(
      (station) =>
        station.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        station.brand?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        station.address.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [gasStations, searchQuery]);

  return {
    gasStations,
    filteredStations,
    isLoading,
    error,
    refetch,
  };
};
