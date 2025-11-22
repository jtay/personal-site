import { BlockStack, Card, InlineStack, Text } from '@shopify/polaris'
import { IconLink } from '../ui/IconLink'
import { FaGithub, FaNpm } from 'react-icons/fa'
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
    icon: EmailIcon,
    url: 'https://github.com/jtay',
  },
]

export const FindMe = () => {
  return (
    <Card>
      <BlockStack gap="300">
        <Text variant="headingMd" as="h3">
          Find me
        </Text>
        <InlineStack align="space-evenly">
          {links.map(({ title, icon, url }, i) => (
            <IconLink title={title} icon={icon} url={url} key={i} />
          ))}
        </InlineStack>
      </BlockStack>
    </Card>
  )
}
