import { useState, useEffect } from 'react';
import type { ToolboxItemDocument } from '../types/toolbox';
import toolboxData from '../data/toolbox.json';

interface UseToolboxItemsParams {
  strapi?: any; // Kept for compatibility but not used
}

interface UseToolboxItemsReturn {
  items: ToolboxItemDocument[];
  isLoading: boolean;
  error: Error | null;
}

export const useToolboxItems = ({
  strapi
}: UseToolboxItemsParams = {}): UseToolboxItemsReturn => {
  const [items, setItems] = useState<ToolboxItemDocument[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Synchronously set from local JSON
    setItems(toolboxData as ToolboxItemDocument[]);
    setIsLoading(false);
  }, []);

  return {
    items,
    isLoading,
    error
  };
};
