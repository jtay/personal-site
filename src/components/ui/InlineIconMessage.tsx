import { BlockStack, Icon, InlineStack, Text } from '@shopify/polaris'

export type InlineIconMessageProps = {
  icon: IconSource
  message: string
  subdued?: boolean
}

export const InlineIconMessage = ({
  icon,
  message,
  subdued = true,
}: InlineIconMessageProps) => {
  const tone = subdued ? 'subdued' : 'base'

  return (
    <InlineStack align="start" blockAlign="center" gap="050">
      {icon && (
        <BlockStack align="center">
          <Icon source={icon} />
        </BlockStack>
      )}
      {message && (
        <Text as="p" variant="bodyXs" tone={tone}>
          {message}
        </Text>
      )}
    </InlineStack>
  )
}
