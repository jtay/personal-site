import {
  BlockStack,
  Box,
  Button,
  Icon,
  Text,
  type IconSource,
} from '@shopify/polaris'

export type IconLinkProps = {
  icon: IconSource
  title: string
  onClick?: () => unknown
  url?: string
}

export const IconLink = ({ icon, title, onClick, url }: IconLinkProps) => {
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
            <BlockStack gap="100">
              {icon && (
                <Text as="h1" variant="headingLg">
                  <Icon source={icon} />
                </Text>
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
