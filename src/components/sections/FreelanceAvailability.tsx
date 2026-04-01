import {
  Badge,
  BlockStack,
  Button,
  Card,
  InlineStack,
  Text,
} from '@shopify/polaris'
import { formatShortMonthYear } from '../../utils/formatShortMonthYear'

import { useEffect, useState } from 'react'
import { LoadingCard } from '../core/LoadingCard'
import { HomepageContactForm } from '../forms/HomepageContactForm'

type Availability = 'AVAILABLE' | 'IN_PROJECT' | 'UNAVAILABLE'
type CurrentAvailability = {
  status: Availability
  message?: string
  availableFrom?: Date
}

const Heading = ({ availability, dayRate, heading }: { availability: CurrentAvailability, dayRate: number, heading: string }) => (
  <InlineStack align="space-between">
    <Text as="h3" variant="headingMd">
      {heading}
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
      <Badge tone="info">{`£${dayRate}/day`}</Badge>
    </InlineStack>
  </InlineStack>
)

import freelanceConfig from '../../data/freelance-config.json'

// ... (keep types the same)
export const FreelanceAvailability = () => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const currentAvailability: CurrentAvailability = {
    status: freelanceConfig.availability as Availability,
    message: freelanceConfig.message,
    availableFrom: freelanceConfig.availableFrom ? new Date(freelanceConfig.availableFrom) : undefined,
  }

  const dayRate = freelanceConfig.hourlyRate * freelanceConfig.hoursPerDay;
  const heading = freelanceConfig.heading;
  const ctaText = freelanceConfig.ctaText;
  const ctaEnabled = freelanceConfig.ctaEnabled;

  return (
    <Card>
      <BlockStack gap="300">
        <Heading availability={currentAvailability} dayRate={dayRate} heading={heading} />
        {currentAvailability?.message && (
          <Text as="p">{currentAvailability.message}</Text>
        )}
        <Button fullWidth variant="primary" disabled={!ctaEnabled} onClick={() => setModalOpen(true)}>
          {ctaText}
        </Button>
      </BlockStack>
      <HomepageContactForm
        active={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </Card>
  )
}