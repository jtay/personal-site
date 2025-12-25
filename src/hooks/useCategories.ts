import { useState, useEffect } from 'react';
import type { CategoryDocument } from '../types/blog';
import type { StrapiCollectionResponse } from '../types/strapi';

interface UseCategoriesParams {
  strapi: any;
}

interface UseCategoriesReturn {
  categories: CategoryDocument[];
  isLoading: boolean;
  error: Error | null;
}

export const useCategories = ({ strapi }: UseCategoriesParams): UseCategoriesReturn => {
  const [categories, setCategories] = useState<CategoryDocument[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesCollection = strapi.collection('api/categories');
        
        const response = await categoriesCollection.find({
          sort: ['name:asc'],
          pagination: { pageSize: 100 }
        }) as StrapiCollectionResponse<CategoryDocument>;

        setCategories(response.data);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch categories'));
        setCategories([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, [strapi]);

  return {
    categories,
    isLoading,
    error
  };
};