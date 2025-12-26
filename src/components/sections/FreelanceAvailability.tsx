import {
  Badge,
  BlockStack,
  Button,
  Card,
  InlineStack,
  Text,
} from '@shopify/polaris'
import { formatShortMonthYear } from '../../utils/formatShortMonthYear'
import { useStrapi } from '../../context/StrapiContext'
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

export const FreelanceAvailability = () => {
  const { strapi } = useStrapi();
  const freelanceConfig = strapi.single('api/freelance-config');
  const [currentAvailability, setCurrentAvailability] = useState<CurrentAvailability | null>(null);
  const [dayRate, setDayRate] = useState<number>(0);
  const [heading, setHeading] = useState<string>('');
  const [ctaText, setCtaText] = useState<string>('');
  const [ctaEnabled, setCtaEnabled] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  useEffect(() => {
    // Example of fetching data from Strapi
    const fetchAvailability = async () => {
      setLoading(true);
      const response = await freelanceConfig.find();
        
      if(!response.data) {
        console.error('No data found for freelance availability');
        setLoading(false);
        return;
      }

      // Get availability data
      const availability = response.data.availability as Availability;
      const availabilityMessage = response.data.message as string;
      const availableFrom = response.data.availableFrom ? new Date(response.data.availableFrom) : undefined;

      setCurrentAvailability({
        status: availability,
        message: availabilityMessage,
        availableFrom: availableFrom,
      });

      // Calculate day rate and populate header state
      const rate = response.data.hourlyRate as number;
      const hoursPerDay = response.data.hoursPerDay as number;
      const calculatedDayRate = rate * hoursPerDay;
      setDayRate(calculatedDayRate);

      const headingText = response.data.heading as string;
      setHeading(headingText);
      setLoading(false);

      // Populate CTA state
      const cta = response.data.ctaText as string;
      const ctaIsEnabled = response.data.ctaEnabled as boolean;
      setCtaText(cta);
      setCtaEnabled(ctaIsEnabled);
    }
    fetchAvailability();
  }, [strapi]);

  if (loading || !currentAvailability) {
    return <LoadingCard />;
  }

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