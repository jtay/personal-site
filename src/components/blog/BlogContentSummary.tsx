import { Text } from '@shopify/polaris'
import type { StrapiContent, StrapiContentInline } from '../../types/strapi'

interface BlogContentSummaryProps {
  content: StrapiContent;
  maxLines?: number;
}

export const BlogContentSummary = ({ 
  content, 
  maxLines = 3 
}: BlogContentSummaryProps) => {
  if (!content || content.length === 0) return null

  // Extract plain text from inline content
  const extractText = (children: StrapiContentInline[]): string => {
    if (!children) return ''
    
    return children.map((child) => {
      if (child.type === 'link') {
        return child.children.map((c) => c.text).join('')
      }
      return child.text
    }).join('')
  }

  // Collect text from content blocks (skip images and code blocks)
  const textBlocks: string[] = []
  
  for (const block of content) {
    if (block.type === 'paragraph' || block.type === 'heading' || block.type === 'quote') {
      const text = extractText(block.children).trim()
      if (text) {
        textBlocks.push(text)
      }
    } else if (block.type === 'list') {
      for (const item of block.children) {
        const text = extractText(item.children).trim()
        if (text) {
          textBlocks.push(text)
        }
      }
    }
    // Skip 'code' and 'image' blocks for summary
  }

  // Take only the first maxLines blocks
  const summaryBlocks = textBlocks.slice(0, maxLines)
  
  if (summaryBlocks.length === 0) return null

  // Combine into a single summary text
  const summaryText = summaryBlocks.join(' ')

  // Optionally truncate if still too long (e.g., very long paragraphs)
  const truncated = summaryText.length > maxLines * 64 
    ? summaryText.slice(0, maxLines * 64) + '...' 
    : summaryText

  return (
    <Text variant="bodyMd" as="p" tone="subdued">
      {truncated}
    </Text>
  )
}