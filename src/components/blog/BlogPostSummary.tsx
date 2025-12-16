import { Avatar, BlockStack, Box, InlineStack, Link, Text } from "@shopify/polaris"
import type { BlogPostDocument } from "../../types/blog"
import { useStrapi } from "../../context/StrapiContext"
import { useNavigate } from "react-router"

type BlogPostSummaryProps = {
    post: BlogPostDocument
}

export const BlogPostSummary = ({ post }: BlogPostSummaryProps) => {
    const navigate = useNavigate()
    const { getImageUrl } = useStrapi();
    return (
        <div onClick={(() => navigate(`/blog/${post.handle}`))} style={{ cursor: "pointer" }}>
            <Box padding="200" background="bg-fill-secondary" borderRadius="200">
                <InlineStack gap="200">
                        <img
                            src={getImageUrl(post.featuredImage_portrait?.url)} 
                            style={{
                                height: 'auto',
                                width: '64px',
                                borderRadius: '0.5rem'
                            }}
                        />
                    <BlockStack gap="200">
                        <BlockStack gap="050">
                            <Link onClick={(() => navigate(`/blog/${post.handle}`))} monochrome removeUnderline>
                                <Text variant="headingSm" as="h4">
                                    {`${post.title || ""}`}
                                </Text>
                                <Text variant="bodySm" tone="subdued" as="h5">
                                    {`${post.subtitle || ""}`}
                                </Text>
                            </Link>
                        </BlockStack>
                        <BlockStack>
                            {post.content[0].children[0].text}
                        </BlockStack>
                        <Text variant="bodyXs" tone="subdued">
                            Posted {new Date(post.publishedAt).toDateString()}
                        </Text>
                    </BlockStack>
                </InlineStack>
            </Box>
        </div>
    )
}