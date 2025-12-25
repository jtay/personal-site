import { useState, useEffect } from 'react';
import type { BlogPostDocument, BlogPostFilters } from '../types/blog';
import type { StrapiCollectionResponse } from '../types/strapi';

interface UseBlogPostsParams {
  strapi: any;
  filters: BlogPostFilters;
  currentPage: number;
  postsPerPage?: number;
  fetchTotalCount?: boolean;
}

interface UseBlogPostsReturn {
  posts: BlogPostDocument[];
  isLoading: boolean;
  error: Error | null;
  totalCount: number;
  totalPages: number;
  overallTotalCount: number; // Total count without any filters
}

export const useBlogPosts = ({
  strapi,
  filters,
  currentPage,
  postsPerPage = 6,
  fetchTotalCount = true
}: UseBlogPostsParams): UseBlogPostsReturn => {
  const [posts, setPosts] = useState<BlogPostDocument[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [overallTotalCount, setOverallTotalCount] = useState<number>(0);

  useEffect(() => {
    const fetchBlogPosts = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const blogPosts = strapi.collection('api/blog-posts');
        
        // Only include filters if there are any active filters
        const hasFilters = Object.keys(filters).length > 0;
        
        const queryParams: any = {
          populate: {
            featuredImage_landscape: true,
            featuredImage_portrait: true,
            categories: {
              fields: ['name']
            }
          },
          pagination: {
            page: currentPage,
            pageSize: postsPerPage
          },
          sort: ['publishedAt:desc']
        };
        
        // Only add filters if they exist
        if (hasFilters) {
          queryParams.filters = filters;
        }
        
        const response = await blogPosts.find(queryParams) as StrapiCollectionResponse<BlogPostDocument>;

        setPosts(response.data);
        setTotalCount(response.meta.pagination.total);
        
        // Fetch overall total count if requested and we have filters
        if (fetchTotalCount && hasFilters) {
          const totalResponse = await blogPosts.find({
            pagination: { page: 1, pageSize: 1 }
          }) as StrapiCollectionResponse<BlogPostDocument>;
          setOverallTotalCount(totalResponse.meta.pagination.total);
        } else if (!hasFilters) {
          // If no filters, the total count is the same as overall
          setOverallTotalCount(response.meta.pagination.total);
        }
      } catch (err) {
        console.error('Error fetching blog posts:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch blog posts'));
        setPosts([]);
        setTotalCount(0);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlogPosts();
  }, [strapi, filters, currentPage, postsPerPage, fetchTotalCount]);

  const totalPages = Math.ceil(totalCount / postsPerPage);

  return {
    posts,
    isLoading,
    error,
    totalCount,
    totalPages,
    overallTotalCount
  };
};