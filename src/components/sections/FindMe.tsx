import { BlockStack, Card, InlineStack, Text } from '@shopify/polaris'
import { IconLink } from '../ui/IconLink'
import { FaEnvelope, FaGithub, FaNpm, FaShopify } from 'react-icons/fa'
import type { IconLinkProps } from '../ui/IconLink'
import { EmailIcon } from '@shopify/polaris-icons'

const links: IconLinkProps[] = [
  {
    title: 'GitHub',
    icon: FaGithub,
    url: 'https://github.com/jtay',
  },
  {
    title: 'npm',
    icon: FaNpm,
    url: 'https://npmjs.com/~jaydon',
  },
  {
    title: 'Email',
    icon: FaEnvelope,
    url: 'https://github.com/jtay',
  },
  {
    title: 'App Store',
    icon: FaShopify,
    url: 'https://apps.shopify.com/partners/jaydon-taylor',
  },
]

export const FindMe = () => {
  return (
    <Card>
      <BlockStack gap="300">
        <Text variant="headingMd" as="h3">
          Get In Touch
        </Text>
        <InlineStack align="space-evenly" gap="300">
          {links.map(({ title, icon, url }, i) => (
            <IconLink title={title} icon={icon} url={url} key={i} />
          ))}
        </InlineStack>
      </BlockStack>
    </Card>
  )
}
