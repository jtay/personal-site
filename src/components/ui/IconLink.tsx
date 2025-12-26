import {
  BlockStack,
  Box,
  Button,
  Text,
} from '@shopify/polaris'
import type { IconType } from 'react-icons'

export type IconLinkProps = {
  icon: IconType
  title: string
  onClick?: () => unknown
  url?: string
}

export const IconLink = ({ icon: Icon, title, onClick, url }: IconLinkProps) => {
  return (
    <Box
      background="bg-fill-active"
      borderRadius="150"
      maxWidth="96px"
      minWidth="96px"
    >
      <BlockStack align="center">
        <Button
          variant="tertiary"
          onClick={onClick ? onClick : undefined}
          url={url ? url : undefined}
          target="_blank"
        >
          {/** @ts-expect-error Button can handle elements */}
          <Box padding="050">
            <BlockStack gap="100" align="center">
              {Icon && (
                <div style={{ textAlign: 'center' }}>
                  <Icon size="24" />
                </div>
              )}
              {title && (
                <Text as="h5" variant="headingXs" tone="subdued">
                  {title}
                </Text>
              )}
            </BlockStack>
          </Box>
        </Button>
      </BlockStack>
    </Box>
  )
}
