import { BlockStack, Card, SkeletonBodyText, SkeletonDisplayText } from '@shopify/polaris'

export const LoadingCard = () => {
  return (
    <Card>
      <BlockStack gap="300">
        <SkeletonDisplayText size="medium" />
        <SkeletonBodyText lines={3} />
      </BlockStack>
    </Card>
  );
}