import type { CategoryDocument } from '../types/blog';
import categoriesData from '../data/categories.json';

interface UseCategoriesReturn {
  categories: CategoryDocument[];
  isLoading: boolean;
  error: Error | null;
}

export const useCategories = (): UseCategoriesReturn => {
  return {
    categories: categoriesData as CategoryDocument[],
    isLoading: false,
    error: null
  };
};