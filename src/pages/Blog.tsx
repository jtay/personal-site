import { BlockStack, Card, Grid, Page } from '@shopify/polaris'
import { HomepageIntroduction } from '../components/sections/HomepageIntroduction'
import { FreelanceAvailability } from '../components/sections/FreelanceAvailability'
import { FindMe } from '../components/sections/FindMe'
import { AboutMe } from '../components/sections/AboutMe'
import { BlogListing } from '../components/sections/BlogListing'

export const Blog = () => {
  return (
    <Page title="Blog">
      <BlockStack>
        <Grid>
          <Grid.Cell columnSpan={{ xs: 6, sm: 4, md: 4, lg: 8, xl: 8 }}>
            <BlockStack gap="300">
              <Card>
                Blog Posts
              </Card>
            </BlockStack>
          </Grid.Cell>
          <Grid.Cell columnSpan={{ xs: 6, sm: 2, md: 2, lg: 4, xl: 4 }}>
            <BlockStack gap="300">
              <Card>
                Right Column
              </Card>
            </BlockStack>
          </Grid.Cell>
        </Grid>
      </BlockStack>
    </Page>
  )
}
