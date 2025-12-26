import { BlockStack, Grid, Page } from '@shopify/polaris'
import { HomepageIntroduction } from '../components/sections/HomepageIntroduction'
import { FreelanceAvailability } from '../components/sections/FreelanceAvailability'
import { FindMe } from '../components/sections/FindMe'
import { AboutMe } from '../components/sections/AboutMe'
import { BlogListing } from '../components/sections/BlogListing'
import { SEO } from '../components/SEO'

export const Home = () => {
  return (
    <>
      <SEO
        title="Home"
        description="Personal website and blog of Jaydon Taylor - Software Engineer & Freelancer"
        type="website"
      />
      <Page title="👋 Hello there!">
        <BlockStack>
          <Grid>
            <Grid.Cell columnSpan={{ xs: 6, sm: 4, md: 4, lg: 8, xl: 8 }}>
              <BlockStack gap="300">
                <HomepageIntroduction />
                <FreelanceAvailability />
                <BlogListing />
              </BlockStack>
            </Grid.Cell>
            <Grid.Cell columnSpan={{ xs: 6, sm: 2, md: 2, lg: 4, xl: 4 }}>
              <BlockStack gap="300">
                <AboutMe />
                <FindMe />
              </BlockStack>
            </Grid.Cell>
          </Grid>
        </BlockStack>
      </Page>
    </>
  )
}
