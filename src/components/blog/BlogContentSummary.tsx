import { Text } from '@shopify/polaris'

interface BlogContentSummaryProps {
  content?: string;
  maxLines?: number;
}

export const BlogContentSummary = ({ 
  content, 
  maxLines = 3 
}: BlogContentSummaryProps) => {
  if (!content) return null

  // Strip basic markdown syntax
  const plainText = content
    .replace(/[#_*`~]/g, '') // remove formatting chars
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Extract link text
    .replace(/!\[.*?\]\([^)]+\)/g, '') // Remove images
    .replace(/<[^>]*>/g, '') // Remove html tags
    .replace(/\n+/g, ' ') // Merge lines
    .trim()

  if (!plainText) return null

  const maxLength = maxLines * 64 // Rough estimate
  const truncated = plainText.length > maxLength 
    ? plainText.slice(0, maxLength) + '...' 
    : plainText

  return (
    <Text variant="bodyMd" as="p" tone="subdued">
      {truncated}
    </Text>
  )
}