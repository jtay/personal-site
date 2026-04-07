import { useState, useEffect } from 'react';
import type { BlogPostDocument, BlogPostFilters } from '../types/blog';
import blogIndex from '../data/blog-index.json';

interface UseBlogPostsParams {
  strapi?: any;
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
  overallTotalCount: number;
}

export const useBlogPosts = ({
  filters,
  currentPage,
  postsPerPage = 6,
}: UseBlogPostsParams): UseBlogPostsReturn => {
  const [posts, setPosts] = useState<BlogPostDocument[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);

  const postsData = blogIndex as any[];

  useEffect(() => {
    let filteredPosts = [...postsData];

    if (filters.categoryIds && filters.categoryIds.length > 0) {
      filteredPosts = filteredPosts.filter(post => 
        post.categories && post.categories.some((cat: string) => 
          filters.categoryIds.includes(cat) 
        )
      );
    }

    if (filters.years && filters.years.length > 0) {
      filteredPosts = filteredPosts.filter(post => {
        const year = new Date(post.publishedAt).getFullYear();
        return filters.years.includes(year);
      });
    }

    if (filters.search) {
      const q = filters.search.toLowerCase();
      filteredPosts = filteredPosts.filter(post => 
        post.title.toLowerCase().includes(q) || 
        post.subtitle.toLowerCase().includes(q)
      );
    }

    setTotalCount(filteredPosts.length);

    // Apply pagination
    const start = (currentPage - 1) * postsPerPage;
    const paginatedPosts = filteredPosts.slice(start, start + postsPerPage);

    setPosts(paginatedPosts as any);
  }, [filters, currentPage, postsPerPage]);

  const totalPages = Math.ceil(totalCount / postsPerPage);

  return {
    posts,
    isLoading: false,
    error: null,
    totalCount,
    totalPages,
    overallTotalCount: postsData.length
  };
};