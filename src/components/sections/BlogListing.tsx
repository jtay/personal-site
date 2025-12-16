import { useStrapi } from "../../context/StrapiContext"
import { BlockStack, Button, Card, InlineStack, Text } from "@shopify/polaris";
import { useEffect, useState } from "react";
import { LoadingCard } from "../core/LoadingCard";
import { BookIcon } from "@shopify/polaris-icons";
import { useNavigate } from "react-router";
import type { BlogPostDocument } from "../../types/blog";
import { BlogPostSummary } from "../blog/BlogPostSummary";

export const BlogListing = () => {
    const navigate = useNavigate()
    const { strapi } = useStrapi();
    const blogPosts = strapi.collection('api/blog-posts');
    const [posts, setPosts] = useState<BlogPostDocument[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    /**
     * Fetches and sets blog posts from Strapi
     */
    useEffect(() => {
        const fetchBlogPosts = async () => {
            const postsResponse = await blogPosts.find({
                pagination: {
                    pageSize: 3
                },
                populate: ["featuredImage_landscape", "featuredImage_portrait"]
            })
            if(postsResponse.data.length > 0) {
                setPosts(postsResponse.data as BlogPostDocument[])
                setIsLoading(false)
            }
        }
        fetchBlogPosts();
    }, []);

    useEffect(() => {
        console.log({
            posts
        })
    }, [posts])
    
    if(isLoading) return <LoadingCard />

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
            <BlockStack>
                {posts.map((post) => {
                  return <BlogPostSummary post={post} />
                })}
            </BlockStack>
        </BlockStack>
    </Card>
    )
}