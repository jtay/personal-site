import { BlockStack, Card, Grid, Page, Text, InlineStack, Button, Pagination } from '@shopify/polaris'
import { useStrapi } from '../context/StrapiContext'
import { BlogPostCard } from '../components/blog/BlogPostCard'
import { BlogFilters } from '../components/blog/BlogFilters'
import { LoadingCard } from '../components/core/LoadingCard'
import { useNavigate } from 'react-router'
import { useBlogFilters } from '../hooks/useBlogFilters'
import { useBlogPosts } from '../hooks/useBlogPosts'
import { useCategories } from '../hooks/useCategories'
import { SEO } from '../components/SEO'
import { getAbsoluteUrl } from '../utils/url'

// Generate years from 2010 to current year
const getAvailableYears = (): number[] => {
  const currentYear = new Date().getFullYear()
  return Array.from(
    { length: currentYear - 2010 + 1 },
    (_, i) => 2010 + i
  ).reverse()
}

export const Blog = () => {
  const navigate = useNavigate()
  const { strapi } = useStrapi()

  // Filter state management
  const {
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
  } = useBlogFilters()

  // Fetch categories
  const { categories, isLoading: categoriesLoading } = useCategories({ strapi })

  // Fetch blog posts with current filters (single hook now fetches both counts)
  const {
    posts,
    isLoading: postsLoading,
    totalCount,
    totalPages,
    overallTotalCount
  } = useBlogPosts({
    strapi,
    filters,
    currentPage,
    postsPerPage: 6
  })

  const availableYears = getAvailableYears()

  // Check if any filters are active
  const hasActiveFilters =
    selectedCategoryIds.length > 0 ||
    selectedYears.length > 0 ||
    searchQuery.trim() !== ''

  // Format number with commas
  const formatNumber = (num: number): string => {
    return num.toLocaleString()
  }

  // Generate subtitle text
  const getSubtitle = (): string => {
    if (hasActiveFilters) {
      return `Showing ${formatNumber(totalCount)} of ${formatNumber(overallTotalCount)} posts`
    }
    return `Showing ${formatNumber(totalCount)} ${totalCount === 1 ? 'post' : 'posts'}`
  }

  // Pagination handlers
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  // Filter change handlers (reset to page 1)
  const handleCategoryChange = (categoryIds: string[]) => {
    setSelectedCategoryIds(categoryIds)
    setCurrentPage(1)
  }

  const handleYearChange = (years: number[]) => {
    setSelectedYears(years)
    setCurrentPage(1)
  }

  const handleSearchChange = (query: string) => {
    setSearchQuery(query)
    setCurrentPage(1)
  }

  const handleClearFilters = () => {
    resetFilters()
  }

  // Initial loading state
  if (postsLoading && posts.length === 0) {
    return <Page><LoadingCard /></Page>
  }

  return (
    <>
      <SEO
        title="Blog"
        description="Read the latest thoughts on software engineering and freelance work."
        url={getAbsoluteUrl('blog')}
        type="website"
      />
      <Page
        /** @ts-expect-error */
        title={(
          <BlockStack>
            <Text variant="headingLg" as="h1">
              All Posts
            </Text>
            <Text variant="bodyMd" as="p" tone="subdued">
              {getSubtitle()}
            </Text>
          </BlockStack>
        )}
        backAction={{
          onAction: () => navigate('/')
        }}
      >
        <BlockStack gap="400">
          <Grid>
            <Grid.Cell columnSpan={{ xs: 6, sm: 4, md: 4, lg: 8, xl: 8 }}>
              <BlockStack gap="400">
                {postsLoading ? (
                  <LoadingCard />
                ) : posts.length === 0 ? (
                  <Card>
                    <BlockStack gap="200">
                      <Text variant="bodyMd" as="p">
                        No posts found matching your filters.
                      </Text>
                      {hasActiveFilters && (
                        <Button onClick={handleClearFilters}>
                          Clear filters
                        </Button>
                      )}
                    </BlockStack>
                  </Card>
                ) : (
                  <BlockStack gap="400">
                    <BlockStack gap="400">
                      {posts.map((post) => (
                        <BlogPostCard key={post.documentId} post={post} />
                      ))}
                    </BlockStack>

                    {totalPages > 1 && (
                      <InlineStack align="center">
                        <Pagination
                          hasPrevious={currentPage > 1}
                          onPrevious={handlePreviousPage}
                          hasNext={currentPage < totalPages}
                          onNext={handleNextPage}
                          label={`Page ${currentPage} of ${totalPages}`}
                        />
                      </InlineStack>
                    )}
                  </BlockStack>
                )}
              </BlockStack>
            </Grid.Cell>

            <Grid.Cell columnSpan={{ xs: 6, sm: 2, md: 2, lg: 4, xl: 4 }}>
              <BlockStack gap="300">
                {!categoriesLoading && categories.length > 0 && (
                  <BlogFilters
                    categories={categories}
                    selectedCategoryIds={selectedCategoryIds}
                    onCategoryChange={handleCategoryChange}
                    years={availableYears}
                    selectedYears={selectedYears}
                    onYearChange={handleYearChange}
                    searchQuery={searchQuery}
                    onSearchChange={handleSearchChange}
                    onClearFilters={handleClearFilters}
                  />
                )}
              </BlockStack>
            </Grid.Cell>
          </Grid>
        </BlockStack>
      </Page>
    </>
  )
}