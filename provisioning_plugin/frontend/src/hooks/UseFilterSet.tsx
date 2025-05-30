import { useLocalStorage } from '@mantine/hooks';
import { useCallback } from 'react';
import type { FilterSetState } from '../types/Filters';
export function useFilterSet(filterKey: string): FilterSetState {
  // Array of active filters (saved to local storage)
  const [activeFilters, setActiveFilters] = useLocalStorage<any[]>({
    key: `inventree-filterset-${filterKey}`,
    defaultValue: [],
    getInitialValueInEffect: false,
  });

  // Callback to clear all active filters from the table
  const clearActiveFilters = useCallback(() => {
    setActiveFilters([]);
  }, []);

  return {
    filterKey,
    activeFilters,
    setActiveFilters,
    clearActiveFilters,
  };
}
