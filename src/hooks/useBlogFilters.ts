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

  // Memoize filters object to prevent infinite loops
  const filters = useMemo((): BlogPostFilters => {
    const filterObj: BlogPostFilters = {};
    const andConditions: any[] = [];

    // Category filter using documentId (Strapi v5)
    if (selectedCategoryIds.length > 0) {
      filterObj.categories = {
        documentId: {
          $in: selectedCategoryIds
        }
      };
    }

    // Year filter on publishedAt - supporting multiple years
    if (selectedYears.length > 0) {
      if (selectedYears.length === 1) {
        // Single year - simple range
        filterObj.publishedAt = {
          $gte: `${selectedYears[0]}-01-01`,
          $lte: `${selectedYears[0]}-12-31`
        };
      } else {
        // Multiple years - use $or with year ranges
        const yearConditions = selectedYears.map(year => ({
          publishedAt: {
            $gte: `${year}-01-01`,
            $lte: `${year}-12-31`
          }
        }));
        andConditions.push({ $or: yearConditions });
      }
    }

    // Search query across title and subtitle
    if (searchQuery.trim()) {
      const searchConditions = [
        { title: { $containsi: searchQuery } },
        { subtitle: { $containsi: searchQuery } }
      ];
      andConditions.push({ $or: searchConditions });
    }

    // If we have multiple AND conditions, wrap them
    if (andConditions.length > 0) {
      (filterObj as any).$and = andConditions;
    }

    return filterObj;
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