import { BlockStack, Box, InlineStack, Link, Text, Badge } from "@shopify/polaris"
import type { BlogPostDocument } from "../../types/blog"
import { useStrapi } from "../../context/StrapiContext"
import { useNavigate } from "react-router"
import { BlogContentSummary } from "./BlogContentSummary"

type BlogPostCardProps = {
    post: BlogPostDocument
}

export const BlogPostCard = ({ post }: BlogPostCardProps) => {
    const navigate = useNavigate()
    const { getImageUrl } = useStrapi();
    
    return (
        <Box 
            padding="400" 
            background="bg-surface" 
            borderRadius="300"
            shadow="100"
        >
            <BlockStack gap="400">
                {post.featuredImage_landscape?.url && (
                    <Box
                        borderRadius="200"
                        background="bg-fill-tertiary"
                        as="div"
                    >
                        <img
                            src={getImageUrl(post.featuredImage_landscape?.url)} 
                            alt={String(post.title)}
                            style={{
                                width: '100%',
                                height: 'auto',
                                display: 'block',
                                borderRadius: '0.5rem'
                            }}
                        />
                    </Box>
                )}
                
                <BlockStack gap="300">
                    <BlockStack gap="200">
                        <Link 
                            onClick={() => navigate(`/blog/${post.handle}`)} 
                            monochrome 
                            removeUnderline
                        >
                            <Text variant="headingLg" as="h2">
                                {post.title}
                            </Text>
                        </Link>
                        
                        {post.subtitle && (
                            <Text variant="bodyMd" tone="subdued" as="p">
                                {post.subtitle}
                            </Text>
                        )}
                    </BlockStack>
                    
                    <BlogContentSummary content={post.content} maxLines={3} />
                    
                    <InlineStack gap="200" align="space-between" blockAlign="center">
                        {post.publishedAt && (    
                            <Text as="p" variant="bodySm" tone="subdued">
                                {new Date(post.publishedAt).toLocaleDateString('en-US', { 
                                    year: 'numeric', 
                                    month: 'long', 
                                    day: 'numeric' 
                                })}
                            </Text>
                        )}
                    </InlineStack>
                </BlockStack>
            </BlockStack>
        </Box>
    )
}