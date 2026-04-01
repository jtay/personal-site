import { BlockStack, Page, Text, InlineStack, Card, SkeletonBodyText, SkeletonDisplayText, Box, Button } from '@shopify/polaris'
import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router'
import type { BlogPostDocument } from '../types/blog'
import { ArrowLeftIcon } from '@shopify/polaris-icons'
import { BlogContent } from '../components/blog/BlogContent'
import { SEO } from '../components/SEO'
import { ArticleStructuredData } from '../components/StructuredData'
import { getAbsoluteUrl } from '../utils/url'
import fm from 'front-matter'
import blogIndex from '../data/blog-index.json'

export const BlogPost = () => {
  const { handle } = useParams<{ handle: string }>()
  const navigate = useNavigate()

  const [post, setPost] = useState<BlogPostDocument | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [notFound, setNotFound] = useState<boolean>(false)

  useEffect(() => {
    const fetchBlogPost = async () => {
      if (!handle) {
        setNotFound(true)
        setIsLoading(false)
        return
      }

      try {
        const matchingMeta = blogIndex.find((p: any) => p.handle === handle) as any;
        
        if (!matchingMeta) {
          setNotFound(true)
          setIsLoading(false)
          return
        }

        const res = await fetch(`/content/blog/${handle}/index.md`)
        
        if (!res.ok) {
          setNotFound(true)
          setIsLoading(false)
          return
        }

        const textContent = await res.text()
        const parsed = fm<any>(textContent)

        setPost({
          ...matchingMeta,
          content: parsed.body,
        })
        setIsLoading(false)

      } catch (error) {
        console.error('Error fetching blog post:', error)
        setNotFound(true)
        setIsLoading(false)
      }
    }

    fetchBlogPost()
  }, [handle])

  if (isLoading) {
    return (
      <Page
        backAction={{ content: 'Blog', onAction: () => navigate('/blog') }}
        title=" "
      >
        <BlockStack gap="400">
          <Card>
            <BlockStack gap="400">
              <SkeletonDisplayText size="large" />
              <SkeletonBodyText lines={3} />
            </BlockStack>
          </Card>
          <Card>
            <SkeletonBodyText lines={10} />
          </Card>
        </BlockStack>
      </Page>
    )
  }

  if (notFound || !post) {
    return (
      <Page
        backAction={{ content: 'Blog', onAction: () => navigate('/blog') }}
        title="Post Not Found"
      >
        <Card>
          <BlockStack gap="400">
            <Text variant="bodyLg" as="p">
              The blog post you're looking for doesn't exist or has been removed.
            </Text>
            <InlineStack>
              <Button onClick={() => navigate('/blog')}>
                Back to Blog
              </Button>
            </InlineStack>
          </BlockStack>
        </Card>
      </Page>
    )
  }

  const imageUrl = post.featuredImage_landscape?.url || post.featuredImage_portrait?.url || undefined;
  const authorName = 'Jaydon Taylor';
  const tags: string[] = [];

  return (
    <>
      <SEO
        title={post.title}
        description={post.subtitle}
        image={imageUrl}
        url={getAbsoluteUrl(`blog/${handle}`)}
        type="article"
        publishedTime={post.publishedAt}
        modifiedTime={post.updatedAt}
        author={authorName}
        tags={tags}
      />

      <ArticleStructuredData
        headline={post.title}
        description={post.subtitle}
        image={imageUrl}
        datePublished={post.publishedAt}
        dateModified={post.updatedAt}
        author={{
          name: authorName,
          url: getAbsoluteUrl('about'),
        }}
        url={getAbsoluteUrl(`blog/${handle}`)}
      />

      <Page
        backAction={{ content: 'Blog', onAction: () => navigate('/blog') }}
        /* @ts-expect-error Title can handle this */
        title={(
          <BlockStack gap="200">
            <BlockStack gap="050">
              <Text variant="headingLg" as="h4">
                {`${post.title || ""}`}
              </Text>
              <Text variant="bodySm" tone="subdued" as="h5">
                {`${post.subtitle || ""}`}
              </Text>
            </BlockStack>
            {post?.publishedAt && (
              <Text variant="bodyXs" tone="subdued" as="span">
                Posted {new Date(post.publishedAt).toDateString()}
              </Text>
            )}
          </BlockStack>
        )}
      >
        <BlockStack gap="500">
          {imageUrl && (
            <Box borderRadius="300">
              <img
                src={imageUrl}
                alt={post.title}
                style={{
                  width: '100%',
                  maxHeight: '300px',
                  objectFit: 'contain',
                  display: 'block',
                  borderRadius: '0.5rem'
                }}
              />
            </Box>
          )}

          <Card>
            <BlockStack gap="500">
              {post.content && <BlogContent content={post.content} />}
            </BlockStack>
          </Card>

          <InlineStack>
            <Button
              icon={ArrowLeftIcon}
              onClick={() => navigate('/blog')}
            >
              Back to Blog
            </Button>
          </InlineStack>
        </BlockStack>
      </Page>
    </>
  )
}