import { useState, useCallback, useMemo } from 'react';
import type { BlogPostFilters } from '../types/blog';

export const useBlogFilters = () => {
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
  const [selectedYears, setSelectedYears] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);

  const resetFilters = useCallback(() => {
    setSelectedCategoryIds([]);
    setSelectedYears([]);
    setSearchQuery('');
    setCurrentPage(1);
  }, []);

  const filters = useMemo((): BlogPostFilters => {
    return {
      categoryIds: selectedCategoryIds,
      years: selectedYears,
      search: searchQuery
    };
  }, [selectedCategoryIds, selectedYears, searchQuery]);

  return {
    selectedCategoryIds,
    setSelectedCategoryIds,
    selectedYears,
    setSelectedYears,
    searchQuery,
    setSearchQuery,
    currentPage,
    setCurrentPage,
    resetFilters,
    filters
  };
};