import { BlockStack, Button, Card, InlineStack, Text } from "@shopify/polaris";
import { BookIcon } from "@shopify/polaris-icons";
import { useNavigate } from "react-router";
import type { BlogPostDocument } from "../../types/blog";
import { BlogPostSummary } from "../blog/BlogPostSummary";
import blogIndex from "../../data/blog-index.json"

export const BlogListing = () => {
    const navigate = useNavigate()
    const posts = blogIndex.slice(0, 3) as unknown as BlogPostDocument[];



    return (<Card>
        <BlockStack gap="200">
            <InlineStack align="space-between" blockAlign="start">
                <Text variant="headingMd" as="h3">
                    Blog Posts
                </Text>
                <Button variant="tertiary" icon={BookIcon} onClick={(() => navigate("/blog"))}>
                    View All
                </Button>
            </InlineStack>
            <BlockStack gap="200">
                {posts.map((post) => {
                  return <BlogPostSummary post={post} />
                })}
            </BlockStack>
        </BlockStack>
    </Card>
    )
}