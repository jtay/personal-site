import { Text, Box } from '@shopify/polaris'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'

export const BlogContent = ({ content }: { content: string }) => {
  if (!content) return null

  return (
    <Box paddingBlockEnd="400">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          p: ({ node, ...props }) => (
            <Box paddingBlockEnd="400">
              <Text as="p" variant="bodyLg">
                <span {...props} />
              </Text>
            </Box>
          ),
          h1: ({ node, children, ...props }) => (
            <Box paddingBlockEnd="400" paddingBlockStart="200">
              <Text as="h1" variant="headingXl">
                {children}
              </Text>
            </Box>
          ),
          h2: ({ node, children, ...props }) => (
            <Box paddingBlockEnd="400" paddingBlockStart="200">
              <Text as="h2" variant="headingLg">
                {children}
              </Text>
            </Box>
          ),
          h3: ({ node, children, ...props }) => (
            <Box paddingBlockEnd="300" paddingBlockStart="200">
              <Text as="h3" variant="headingMd">
                {children}
              </Text>
            </Box>
          ),
          h4: ({ node, children, ...props }) => (
            <Box paddingBlockEnd="200" paddingBlockStart="100">
              <Text as="h4" variant="headingSm">
                {children}
              </Text>
            </Box>
          ),
          ul: ({ node, children, ...props }) => (
            <ul style={{ paddingInlineStart: 'var(--p-space-400)', paddingBlockEnd: 'var(--p-space-400)', color: 'inherit' }} {...props as any}>
              {children}
            </ul>
          ),
          ol: ({ node, children, ...props }) => (
            <ol style={{ paddingInlineStart: 'var(--p-space-400)', paddingBlockEnd: 'var(--p-space-400)', color: 'inherit' }} {...props as any}>
              {children}
            </ol>
          ),
          li: ({ node, ...props }) => (
            <li style={{ marginBottom: '0.5rem' }}>
              <Text as="span" variant="bodyLg">
                <span {...props} />
              </Text>
            </li>
          ),
          a: ({ node, ...props }) => (
            <a 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ color: 'var(--p-color-text-link)', textDecoration: 'underline' }}
              {...props as any}
            />
          ),
          blockquote: ({ node, ...props }) => (
            <Box 
              paddingInlineStart="400" 
              borderInlineStartWidth="050" 
              borderColor="border-brand"
              paddingBlockEnd="400"
            >
              <Text as="span" variant="bodyLg" tone="subdued">
                <span {...props} />
              </Text>
            </Box>
          ),
          code: (props) => {
            const {children, className, node, ...rest} = props
            const match = /language-(\w+)/.exec(className || '')
            return match ? (
              <Box 
                padding="400" 
                background="bg-fill-tertiary" 
                borderRadius="200"
              >
                <code {...rest} className={className}>
                  {children}
                </code>
              </Box>
            ) : (
              <code 
                {...rest}
                style={{
                  backgroundColor: 'var(--p-color-bg-fill-tertiary)',
                  padding: '0.125rem 0.25rem',
                  borderRadius: '0.25rem',
                  fontFamily: 'monospace',
                  fontSize: '0.875em'
                }}
                className={className}
              >
                {children}
              </code>
            )
          },
          pre: ({ node, ...props }) => (
            <Box paddingBlockEnd="400">
              <pre {...props} style={{ margin: 0 }} />
            </Box>
          ),
          img: ({ node, ...props }) => (
            <Box paddingBlockStart="400" paddingBlockEnd="400">
              <img 
                style={{
                  maxWidth: '100%',
                  maxHeight: '400px',
                  objectFit: 'contain',
                  borderRadius: 'var(--p-border-radius-200)',
                  display: 'block',
                  margin: '0 auto'
                }}
                {...props} 
              />
              {props.alt && (
                <Box paddingBlockStart="200">
                   <Text variant="bodySm" as="p" tone="subdued" alignment="center">
                    {props.alt}
                  </Text>
                </Box>
              )}
            </Box>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </Box>
  )
}