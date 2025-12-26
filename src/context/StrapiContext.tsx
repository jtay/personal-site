import React, { createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import { strapi as createStrapiClient } from '@strapi/client';
import type { StrapiClient } from '@strapi/client';

// Define the shape of your Strapi context
interface StrapiContextType {
  strapi: StrapiClient;
  getImageUrl: (path: string) => string;
}

// Create the context with undefined as default
const StrapiContext = createContext<StrapiContextType | undefined>(undefined);

interface StrapiProviderProps {
  children: ReactNode;
}

export const StrapiProvider: React.FC<StrapiProviderProps> = ({ children }) => {
  const strapiClient = React.useMemo(() => {
    const url = import.meta.env.VITE_STRAPI_URL;
    const token = import.meta.env.VITE_STRAPI_TOKEN;

    if (!url) {
      throw new Error('STRAPI_URL environment variable is required');
    }

    const client = createStrapiClient({
      baseURL: url,
      ...(token && { auth: token }),
    });

    return client;
  }, []);

  const getImageUrl = React.useCallback((path: string): string => {
    const url = import.meta.env.VITE_STRAPI_URL;
    if(path.includes('://')){
      return path;
    }
    // Remove leading slash from path if present to avoid double slashes
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    // Remove trailing slash from URL if present
    const cleanUrl = url.endsWith('/') ? url.slice(0, -1) : url;
    return `${cleanUrl}/${cleanPath}`;
  }, []);

  return (
    <StrapiContext.Provider value={{ strapi: strapiClient, getImageUrl }}>
      {children}
    </StrapiContext.Provider>
  );
};

// Custom hook to use the Strapi context
export const useStrapi = (): StrapiContextType => {
  const context = useContext(StrapiContext);

  if (context === undefined) {
    throw new Error('useStrapi must be used within a StrapiProvider');
  }

  return context;
};