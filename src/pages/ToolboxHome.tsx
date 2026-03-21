import React from 'react';
import { Page, Grid, Card, BlockStack, Text, Box, InlineStack, Badge } from '@shopify/polaris';
import { useStrapi } from '../context/StrapiContext';
import { useToolboxItems } from '../hooks/useToolboxItems';
import { Link } from 'react-router';
import { SEO } from '../components/SEO';

export const ToolboxHome = () => {
  const { strapi, getImageUrl } = useStrapi();
  const { items, isLoading, error } = useToolboxItems({ strapi });

  if (error) {
    return (
      <Page title="Toolbox">
        <Banner status="critical">
          <p>Error loading tools: {error.message}</p>
        </Banner>
      </Page>
    );
  }

  return (
    <>
      <SEO
        title="Toolbox"
        description="A collection of helpful web tools and experiments."
        type="website"
      />
      <Page title="Toolbox" subtitle="A collection of helpful web tools and experiments.">
        <BlockStack gap="500">
          {isLoading ? (
            <Text as="p">Loading tools...</Text>
          ) : (
            <Grid>
              {items.map((item) => (
                <Grid.Cell key={item.id} columnSpan={{ xs: 6, sm: 3, md: 3, lg: 4, xl: 4 }}>
                  <Link to={`/toolbox/${item.slug}`} style={{ textDecoration: 'none' }}>
                    <Card padding="400">
                      <BlockStack gap="300">
                        {item.image && (
                          <div
                            style={{
                              minHeight: '150px',
                              backgroundColor: item.color || '#f4f6f8',
                              borderRadius: 'var(--p-border-radius-200)',
                              overflow: 'hidden',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            <img
                              src={getImageUrl(item.image.url)}
                              alt={item.title}
                              style={{
                                maxWidth: '100%',
                                maxHeight: '150px',
                                objectFit: 'contain'
                              }}
                            />
                          </div>
                        )}
                        <BlockStack gap="100">
                          <Text variant="headingMd" as="h3">
                            {item.title}
                          </Text>
                          {item.subtitle && (
                            <Text variant="bodyMd" as="p" tone="subdued">
                              {item.subtitle}
                            </Text>
                          )}
                        </BlockStack>
                        <InlineStack align="end">
                           <Badge tone="info">View Tool</Badge>
                        </InlineStack>
                      </BlockStack>
                    </Card>
                  </Link>
                </Grid.Cell>
              ))}
            </Grid>
          )}
        </BlockStack>
      </Page>
    </>
  );
};

// Simple Banner replacement if Polaris Banner is missing in this version
const Banner = ({ children, status }: { children: React.ReactNode, status: string }) => (
  <Box padding="400" background="bg-surface-critical" borderRadius="200">
    {children}
  </Box>
);
