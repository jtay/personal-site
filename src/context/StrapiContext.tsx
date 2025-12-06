import React, { createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import { strapi as createStrapiClient } from '@strapi/client';
import type { StrapiClient } from '@strapi/client';

// Define the shape of your Strapi context
interface StrapiContextType {
  strapi: StrapiClient;
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

  return (
    <StrapiContext.Provider value={{ strapi: strapiClient }}>
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