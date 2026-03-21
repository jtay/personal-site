import { useState, useEffect } from 'react';
import type { ToolboxItemDocument } from '../types/toolbox';
import type { StrapiCollectionResponse } from '../types/strapi';

interface UseToolboxItemsParams {
  strapi: any;
}

interface UseToolboxItemsReturn {
  items: ToolboxItemDocument[];
  isLoading: boolean;
  error: Error | null;
}

export const useToolboxItems = ({
  strapi
}: UseToolboxItemsParams): UseToolboxItemsReturn => {
  const [items, setItems] = useState<ToolboxItemDocument[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchToolboxItems = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const toolboxItems = strapi.collection('api/toolbox-items');
        
        const queryParams: any = {
          populate: {
            image: true
          },
          sort: ['title:asc'],
          pagination: {
            pageSize: 100 // Fetch all for now
          }
        };
        
        const response = await toolboxItems.find(queryParams) as StrapiCollectionResponse<ToolboxItemDocument>;

        setItems(response.data);
      } catch (err) {
        console.error('Error fetching toolbox items:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch toolbox items'));
        setItems([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchToolboxItems();
  }, [strapi]);

  return {
    items,
    isLoading,
    error
  };
};
