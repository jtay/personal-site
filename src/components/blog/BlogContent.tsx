import { Text, Box } from '@shopify/polaris'
import { useStrapi } from '../../context/StrapiContext'
import type {
  StrapiContent,
  StrapiContentInline,
  StrapiContentText,
} from '../../types/strapi'

export const BlogContent = ({ content }: { content: StrapiContent }) => {
  const { getImageUrl } = useStrapi();
  
  if (!content || content.length === 0) return null

  // Helper function to render inline text with formatting
  const renderInlineContent = (children: StrapiContentInline[]) => {
    if (!children || children.length === 0) return null

    return children.map((child, idx) => {
      if (child.type === 'link') {
        // Render links
        const linkText = child.children.map((c) => c.text).join('')
        return (
          <a 
            key={idx} 
            href={child.url} 
            target="_blank" 
            rel="noopener noreferrer"
            style={{ color: 'var(--p-color-text-link)' }}
          >
            {linkText}
          </a>
        )
      }

      // Handle text nodes with formatting
      const textNode = child as StrapiContentText
      const text = textNode.text
      
      // Handle inline code
      if (textNode.code) {
        return (
          <code 
            key={idx}
            style={{
              backgroundColor: 'var(--p-color-bg-fill-tertiary)',
              padding: '0.125rem 0.25rem',
              borderRadius: '0.25rem',
              fontFamily: 'monospace',
              fontSize: '0.875em'
            }}
          >
            {text}
          </code>
        )
      }

      // Build nested formatting styles
      if (textNode.bold || textNode.italic || textNode.underline) {
        const style: React.CSSProperties = {}
        
        if (textNode.bold) {
          style.fontWeight = 'bold'
        }
        if (textNode.italic) {
          style.fontStyle = 'italic'
        }
        if (textNode.underline) {
          style.textDecoration = 'underline'
        }

        return (
          <span key={idx} style={style}>
            {text}
          </span>
        )
      }

      return <span key={idx}>{text}</span>
    })
  }

  return (
    <>
      {content.map((block, index) => {
        // Paragraph
        if (block.type === 'paragraph') {
          return (
            <Text key={index} variant="bodyLg" as="p">
              {renderInlineContent(block.children)}
            </Text>
          )
        }
        
        // Headings
        if (block.type === 'heading') {
          const level = block.level
          
          if (level === 1) {
            return (
              <Text key={index} variant="headingXl" as="h1">
                {renderInlineContent(block.children)}
              </Text>
            )
          } else if (level === 2) {
            return (
              <Text key={index} variant="headingLg" as="h2">
                {renderInlineContent(block.children)}
              </Text>
            )
          } else if (level === 3) {
            return (
              <Text key={index} variant="headingMd" as="h3">
                {renderInlineContent(block.children)}
              </Text>
            )
          } else if (level === 4) {
            return (
              <Text key={index} variant="headingSm" as="h4">
                {renderInlineContent(block.children)}
              </Text>
            )
          } else {
            return (
              <Text key={index} variant="headingXs" as="h5">
                {renderInlineContent(block.children)}
              </Text>
            )
          }
        }

        // Lists
        if (block.type === 'list') {
          const listItems = block.children.map((item, itemIndex) => (
            <Text key={itemIndex} variant="bodyLg" as="span">
              {renderInlineContent(item.children)}
            </Text>
          ))

          return block.format === 'ordered' ? (
            <Box key={index} as="ul" paddingInlineStart="400">
              {listItems}
            </Box>
          ) : (
            <Box key={index} as="ul" paddingInlineStart="400">
              {listItems}
            </Box>
          )
        }

        // Block Quote
        if (block.type === 'quote') {
          return (
            <Box 
              key={index}
              paddingInlineStart="400" 
              borderInlineStartWidth="050" 
              borderColor="border-brand"
            >
              <Text variant="bodyLg" as="p">
                {renderInlineContent(block.children)}
              </Text>
            </Box>
          )
        }

        // Code Block
        if (block.type === 'code') {
          const text = block.children.map((child) => child.text).join('')
          return (
            <Box 
              key={index}
              paddingBlock="0"
              padding="400" 
              background="bg-fill-tertiary" 
              borderRadius="200"
            >
              <Text variant="bodyMd" as="p" numeric>
                <pre>
                    {text}
                </pre>
              </Text>
            </Box>
          )
        }

        // Image
        if (block.type === 'image') {
          const image = block.image
          if (!image) return null

          return (
            <Box key={index} paddingBlockStart="400" paddingBlockEnd="400">
              <img 
                src={image.url}
                alt={image.alternativeText || image.name}
                style={{
                  maxWidth: '100%',
                  height: 'auto',
                  borderRadius: 'var(--p-border-radius-200)'
                }}
              />
              {image.caption && (
                <Text variant="bodySm" as="p" tone="subdued" alignment="center">
                  {image.caption}
                </Text>
              )}
            </Box>
          )
        }

        return null
      })}
    </>
  )
}