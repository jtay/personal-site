import { Card, BlockStack, Text, Link } from '@shopify/polaris'

export const HomepageIntroduction = () => {
  return (
    <Card>
      <BlockStack gap="300">
        <Text as="p">
          I'm Jaydon, I specialise in building bespoke backend Shopify apps and
          integrations. From starting web development from the age of 13, I've
          built a deep understanding of programming fundamentals and a passion
          for building clean, scalable systems.
        </Text>
        <Text as="p">
          Currently full-time at{' '}
          <Link url="https://gymking.com/" target="_blank" monochrome>
            GYMKING
          </Link>
          , a gymwear brand in Leeds, UK.
        </Text>
        <Text as="p">
          I'm a huge advocate for open source software and enjoy building
          complex systems with a focus on developer experience.
        </Text>
      </BlockStack>
    </Card>
  )
}
