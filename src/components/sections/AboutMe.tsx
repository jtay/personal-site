import {
  Avatar,
  BlockStack,
  Box,
  Card,
  InlineStack,
  List,
  Text,
} from '@shopify/polaris'
import { LocationIcon, WorkIcon } from '@shopify/polaris-icons'
import { InlineIconMessage } from '../ui/InlineIconMessage'

export const AboutMe = () => {
  return (
    <Card>
      <BlockStack gap="200">
        <Box background="bg-fill-active" padding="300" borderRadius="200">
          <BlockStack gap="300">
            <InlineStack gap="200" blockAlign="center">
              <Box maxWidth="25%">
                <Avatar
                  source="http://localhost:5173/assets/jaydon.jpg"
                  size="xl"
                />
              </Box>
              <Box maxWidth="65%">
                <BlockStack align="center">
                  <Text as="h2" variant="headingMd">
                    Jaydon Taylor
                  </Text>
                  <BlockStack gap="100">
                    <Text as="p" variant="bodySm">
                      Web Developer
                    </Text>
                  </BlockStack>
                </BlockStack>
              </Box>
            </InlineStack>
            <InlineStack gap="300" align="space-around">
              <InlineIconMessage icon={LocationIcon} message="Leeds, UK" />
              <InlineIconMessage icon={WorkIcon} message="Onstate Ltd" />
            </InlineStack>
          </BlockStack>
        </Box>
        <List>
          <List.Item>14yrs experience in web development</List.Item>
          <List.Item>Specialised in Shopify Plus</List.Item>
          <List.Item>Shopify Academy Certified</List.Item>
          <List.Item>More than 5 delighted freelance clients</List.Item>
        </List>
      </BlockStack>
    </Card>
  )
}
