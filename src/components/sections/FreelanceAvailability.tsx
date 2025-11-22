import {
  Badge,
  BlockStack,
  Button,
  Card,
  InlineStack,
  Text,
} from '@shopify/polaris'
import { formatShortMonthYear } from '../../utils/formatShortMonthYear'

type Availability = 'AVAILABLE' | 'IN_PROJECT' | 'UNAVAILABLE'
type CurrentAvailability = {
  status: Availability
  message?: string
  availableFrom?: Date
}

// Mock current availability
const currentAvailability: CurrentAvailability = {
  status: 'IN_PROJECT',
  message:
    'After-hours and weekend work is available for a limited number of projects.',
  availableFrom: new Date(2026, 6, 1),
}

const Heading = ({ availability }: { availability: CurrentAvailability }) => (
  <InlineStack align="space-between">
    <Text as="h3" variant="headingMd">
      Freelance Availability
    </Text>
    <InlineStack gap="100">
      {availability.status === 'AVAILABLE' && (
        <Badge tone="success" progress="complete">
          Available
        </Badge>
      )}
      {availability.status === 'IN_PROJECT' && (
        <Badge tone="attention" progress="complete">
          {availability?.availableFrom
            ? 'Available ' +
              formatShortMonthYear({ date: availability.availableFrom })
            : 'Available soon'}
        </Badge>
      )}
      {availability.status === 'UNAVAILABLE' && (
        <Badge tone="critical" progress="complete">
          Unavailable
        </Badge>
      )}
      <Badge tone="info">£480/day</Badge>
    </InlineStack>
  </InlineStack>
)

export const FreelanceAvailability = () => {
  return (
    <Card>
      <BlockStack gap="300">
        <Heading availability={currentAvailability} />
        {currentAvailability?.message && (
          <Text as="p">{currentAvailability.message}</Text>
        )}
        <Button fullWidth variant="primary" disabled>
          Contact me
        </Button>
      </BlockStack>
    </Card>
  )
}
