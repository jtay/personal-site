import { BlockStack, Page, Text, InlineStack, Card, SkeletonBodyText, SkeletonDisplayText, Box, Button } from '@shopify/polaris'
import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router'
import { useStrapi } from '../context/StrapiContext'
import type { BlogPostDocument } from '../types/blog'
import { ArrowLeftIcon } from '@shopify/polaris-icons'
import { BlogContent } from '../components/blog/BlogContent'
import { SEO } from '../components/SEO'
import { ArticleStructuredData } from '../components/StructuredData'
import { getAbsoluteUrl } from '../utils/url'

export const BlogPost = () => {
  const { handle } = useParams<{ handle: string }>()
  const navigate = useNavigate()
  const { strapi, getImageUrl } = useStrapi()
  const blogPosts = strapi.collection('api/blog-posts')

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
        const postsResponse = await blogPosts.find({
          filters: {
            handle: {
              $eq: handle
            }
          },
          populate: ["featuredImage_landscape", "featuredImage_portrait"]
        })

        if (postsResponse.data.length > 0) {
          setPost(postsResponse.data[0] as BlogPostDocument)
          console.log({
            response: postsResponse.data[0]
          })
          setIsLoading(false)
        } else {
          setNotFound(true)
          setIsLoading(false)
        }
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


  const imageUrl = post.featuredImage_landscape?.url
    ? getImageUrl(post.featuredImage_landscape.url)
    : undefined;

  // Use subtitle as description since excerpt is missing
  // Default author to site owner since author field is missing in type
  const authorName = 'Jaydon Taylor';
  const tags: string[] = []; // Default empty since tags missing in type

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
          {/* Featured Image */}
          {post.featuredImage_landscape?.url && (
            <Box borderRadius="300">
              <img
                src={getImageUrl(post.featuredImage_landscape.url)}
                alt={post.title}
                style={{
                  width: '100%',
                  height: 'auto',
                  display: 'block',
                  borderRadius: '0.5rem'
                }}
              />
            </Box>
          )}

          {/* Content Card */}
          <Card>
            <BlockStack gap="500">
              {post.content && <BlogContent content={post.content} />}
            </BlockStack>
          </Card>

          {/* Back to Blog Button */}
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