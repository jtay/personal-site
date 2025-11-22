import { BlockStack, Grid, Page } from '@shopify/polaris'
import { HomepageIntroduction } from '../components/sections/HomepageIntroduction'
import { FreelanceAvailability } from '../components/sections/FreelanceAvailability'
import { FindMe } from '../components/sections/FindMe'

export const Home = () => {
  return (
    <Page title="👋 Hello there!">
      <BlockStack>
        <Grid>
          <Grid.Cell columnSpan={{ xs: 6, sm: 4, lg: 4, xl: 8 }}>
            <BlockStack gap="300">
              <HomepageIntroduction />
              <FreelanceAvailability />
              <FindMe />
            </BlockStack>
          </Grid.Cell>
        </Grid>
      </BlockStack>
    </Page>
  )
}
