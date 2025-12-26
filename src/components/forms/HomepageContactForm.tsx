import { useState, useCallback, useRef, useEffect } from 'react';
import { useForm, ValidationError } from '@formspree/react';
import validator from 'validator';
import {
  Modal,
  Form,
  TextField,
  Select,
  Checkbox,
  Banner,
  Text,
  BlockStack,
  InlineStack,
  Box,
  ProgressBar,
  Grid,
  Icon,
} from '@shopify/polaris';
import {
  PersonIcon,
  EmailIcon,
  StoreIcon,
  GlobeIcon,
  NoteIcon,
} from '@shopify/polaris-icons';

interface FormData {
  name: string;
  email: string;
  company: string;
  website: string;
  platform: string;
  teamSize: string;
  monthlyRevenue: string;
  budget: string;
  projectType: string[];
  timeline: string;
  message: string;
}

interface SteppedContactFormModalProps {
  active: boolean;
  onClose: () => void;
}

export const HomepageContactForm = ({ active, onClose }: SteppedContactFormModalProps) => {
  const [state, handleSubmit] = useForm('homepageContact');
  const [currentStep, setCurrentStep] = useState(0);
  const modalContentRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [emailError, setEmailError] = useState<string>('');
  
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    company: '',
    website: '',
    platform: '',
    teamSize: '',
    monthlyRevenue: '',
    budget: '',
    projectType: [],
    timeline: '',
    message: '',
  });

  const totalSteps = 4;
  const progress = ((currentStep + 1) / totalSteps) * 100;

  // Scroll to top when step changes
  useEffect(() => {
    if (modalContentRef.current) {
      modalContentRef.current.scrollTop = 0;
    }
  }, [currentStep]);

  // Reset form when modal closes
  useEffect(() => {
    if (!active) {
      setCurrentStep(0);
      setEmailError('');
      setFormData({
        name: '',
        email: '',
        company: '',
        website: '',
        platform: '',
        teamSize: '',
        monthlyRevenue: '',
        budget: '',
        projectType: [],
        timeline: '',
        message: '',
      });
    }
  }, [active]);

  const handleFieldChange = useCallback((field: keyof FormData) => (value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Validate email field
    if (field === 'email') {
      if (value && !validator.isEmail(value)) {
        setEmailError('Please enter a valid email address');
      } else {
        setEmailError('');
      }
    }
  }, []);

  const handleCheckboxChange = useCallback((option: string) => (checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      projectType: checked
        ? [...prev.projectType, option]
        : prev.projectType.filter(item => item !== option)
    }));
  }, []);

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 0: // Personal Info
        return !!(
          formData.name && 
          formData.email && 
          validator.isEmail(formData.email) &&
          formData.company
        );
      case 1: // Project Details
        return !!(formData.platform && formData.budget);
      case 2: // Project Type
        return formData.projectType.length > 0;
      case 3: // Timeline & Message
        return !!(formData.timeline && formData.message);
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Formspree expects a native form submission
    if (formRef.current) {
      /** @ts-expect-error */
      await handleSubmit(e);
    }
  };

  const getPrimaryAction = () => {
    if (state.succeeded) {
      return {
        content: 'Close',
        onAction: onClose,
      };
    }

    if (currentStep === totalSteps - 1) {
      return {
        content: 'Send Inquiry',
        onAction: () => {
          // Trigger form submission programmatically
          if (formRef.current) {
            formRef.current.dispatchEvent(
              new Event('submit', { cancelable: true, bubbles: true })
            );
          }
        },
        loading: state.submitting,
        disabled: state.submitting || !validateStep(currentStep),
      };
    }

    return {
      content: 'Next',
      onAction: handleNext,
      disabled: !validateStep(currentStep),
    };
  };

  const getSecondaryActions = () => {
    if (state.succeeded) {
      return [];
    }

    if (currentStep === 0) {
      return [
        {
          content: 'Cancel',
          onAction: onClose,
        },
      ];
    }

    return [
      {
        content: 'Back',
        onAction: handleBack,
      },
    ];
  };

  const renderStepContent = () => {
    if (state.succeeded) {
      return (
        <BlockStack gap="400">
          <Text variant="headingLg" as="h2">
            Thank you for reaching out!
          </Text>
          <Banner tone="success">
            <p>
              Your message has been sent successfully. I'll get back to you within 24-48 hours to discuss your project needs.
            </p>
          </Banner>
        </BlockStack>
      );
    }

    switch (currentStep) {
      case 0:
        return (
          <BlockStack gap="400">
            <BlockStack gap="200">
              <Text variant="headingMd" as="h3">
                Let's start with your details
              </Text>
              <Text variant="bodyMd" as="p" tone="subdued">
                Tell me a bit about yourself and your company
              </Text>
            </BlockStack>

            <TextField
              label="Full Name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleFieldChange('name')}
              autoComplete="name"
              requiredIndicator
              prefix={<Icon source={PersonIcon} />}
            />
            <ValidationError prefix="Name" field="name" errors={state.errors} />

            <TextField
              label="Email Address"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleFieldChange('email')}
              autoComplete="email"
              requiredIndicator
              error={emailError}
              prefix={<Icon source={EmailIcon} />}
            />
            <ValidationError prefix="Email" field="email" errors={state.errors} />

            <TextField
              label="Company Name"
              type="text"
              name="company"
              value={formData.company}
              onChange={handleFieldChange('company')}
              autoComplete="organization"
              requiredIndicator
              prefix={<Icon source={StoreIcon} />}
            />
            <ValidationError prefix="Company" field="company" errors={state.errors} />

            <TextField
              label="Current Website (optional)"
              type="url"
              name="website"
              value={formData.website}
              onChange={handleFieldChange('website')}
              autoComplete="url"
              prefix={<Icon source={GlobeIcon} />}
            />
            <ValidationError prefix="Website" field="website" errors={state.errors} />
          </BlockStack>
        );

      case 1:
        return (
          <BlockStack gap="400">
            <BlockStack gap="200">
              <Text variant="headingMd" as="h3">
                Project details
              </Text>
              <Text variant="bodyMd" as="p" tone="subdued">
                Help me understand your current setup and budget
              </Text>
            </BlockStack>

            <Select
              label="Current Platform"
              options={[
                { label: 'Select platform', value: '' },
                { label: 'Shopify', value: 'Shopify' },
                { label: 'Shopify Plus', value: 'Shopify Plus' },
                { label: 'Other Platform (Migration)', value: 'Other Platform (Migration)' },
                { label: 'New Store', value: 'New Store' },
              ]}
              name="platform"
              value={formData.platform}
              onChange={handleFieldChange('platform')}
              requiredIndicator
            />
            <ValidationError prefix="Platform" field="platform" errors={state.errors} />

            <Select
              label="Project Budget"
              options={[
                { label: 'Select project budget', value: '' },
                { label: 'Unsure / Just exploring', value: 'Unsure / Just exploring' },
                { label: 'Under £1k', value: 'Under £1k' },
                { label: '£1k - £4k', value: '£1k - £4k' },
                { label: '£5k - £9k', value: '£5k - £9k' },
                { label: '£10k - £49k', value: '£10k - £49k' },
                { label: '£50k - £99k', value: '£50k - £99k' },
                { label: '£100k+', value: '£100k+' },
              ]}
              name="budget"
              value={formData.budget}
              onChange={handleFieldChange('budget')}
              requiredIndicator
            />
            <ValidationError prefix="Budget" field="budget" errors={state.errors} />

            <Select
              label="Team Size (optional)"
              options={[
                { label: 'Select team size', value: '' },
                { label: 'Just me', value: 'Just me' },
                { label: '2-5', value: '2-5' },
                { label: '6-10', value: '6-10' },
                { label: '11-25', value: '11-25' },
                { label: '26-50', value: '26-50' },
                { label: '50+', value: '50+' },
              ]}
              name="teamSize"
              value={formData.teamSize}
              onChange={handleFieldChange('teamSize')}
            />
            <ValidationError prefix="Team Size" field="teamSize" errors={state.errors} />

            <Select
              label="Monthly Revenue (optional)"
              options={[
                { label: 'Select monthly revenue', value: '' },
                { label: 'Pre-launch', value: 'Pre-launch' },
                { label: 'Under £4k', value: 'Under £4k' },
                { label: '£5k - £9k', value: '£5k - £9k' },
                { label: '£10k - £49k', value: '£10k - £49k' },
                { label: '£50k - £99k', value: '£50k - £99k' },
                { label: '£100k - £499k', value: '£100k - £499k' },
                { label: '£500k+', value: '£500k+' },
              ]}
              name="monthlyRevenue"
              value={formData.monthlyRevenue}
              onChange={handleFieldChange('monthlyRevenue')}
            />
            <ValidationError prefix="Monthly Revenue" field="monthlyRevenue" errors={state.errors} />
          </BlockStack>
        );

      case 2:
        return (
          <BlockStack gap="400">
            <BlockStack gap="200">
              <Text variant="headingMd" as="h3">
                What do you need help with?
              </Text>
              <Text variant="bodyMd" as="p" tone="subdued">
                Select all that apply
              </Text>
            </BlockStack>

            <BlockStack gap="300">
              <Grid>
                {[
                  'Custom theme development',
                  'Theme customization',
                  'App integration',
                  'Custom app development',
                  'Store setup and configuration',
                  'Data design & migration',
                  'Solution architecture',
                  'Migration to Shopify/Plus',
                  'Performance optimization',
                  'Ongoing maintenance',
                  'Other',
                ].map((option) => (
                  <Grid.Cell key={option} columnSpan={{ xs: 6, sm: 6, md: 6, lg: 6, xl: 6 }}>
                    <Checkbox
                      label={option}
                      checked={formData.projectType.includes(option)}
                      onChange={handleCheckboxChange(option)}
                    />
                  </Grid.Cell>
                ))}
              </Grid>
              <ValidationError prefix="Project Type" field="projectType" errors={state.errors} />
            </BlockStack>
          </BlockStack>
        );

      case 3:
        return (
          <BlockStack gap="400">
            <BlockStack gap="200">
              <Text variant="headingMd" as="h3">
                Timeline and project details
              </Text>
              <Text variant="bodyMd" as="p" tone="subdued">
                When do you need this completed and what are your goals?
              </Text>
            </BlockStack>

            <Select
              label="Desired Timeline"
              options={[
                { label: 'Select desired timeline', value: '' },
                { label: 'Just exploring', value: 'Just exploring' },
                { label: 'ASAP', value: 'ASAP' },
                { label: 'Within 1 month', value: 'Within 1 month' },
                { label: '1-3 months', value: '1-3 months' },
                { label: '3-6 months', value: '3-6 months' },
              ]}
              name="timeline"
              value={formData.timeline}
              onChange={handleFieldChange('timeline')}
              requiredIndicator
            />
            <ValidationError prefix="Timeline" field="timeline" errors={state.errors} />

            <TextField
              label="Tell me about your project"
              type="text"
              name="message"
              value={formData.message}
              onChange={handleFieldChange('message')}
              multiline={8}
              autoComplete="off"
              requiredIndicator
              helpText="Share as much detail as you'd like about your goals, challenges, and vision"
              prefix={<Icon source={NoteIcon} />}
            />
            <ValidationError prefix="Message" field="message" errors={state.errors} />

            {state.errors && (
              <Banner tone="critical">
                <p>There was an error submitting your form. Please check your entries and try again.</p>
              </Banner>
            )}
          </BlockStack>
        );

      default:
        return null;
    }
  };

  return (
    <Modal
      open={active}
      onClose={onClose}
      title={state.succeeded ? "Success!" : "Let's Build Something Amazing"}
      /** @ts-expect-error */
      primaryAction={getPrimaryAction()}
      secondaryActions={getSecondaryActions()}
      large
    >
      <Modal.Section>
        <div ref={modalContentRef}>
          <BlockStack gap="400">
            {!state.succeeded && (
              <Box>
                <BlockStack gap="200">
                  <InlineStack align="space-between" blockAlign="center">
                    <Text variant="bodySm" as="p" tone="subdued">
                      Step {currentStep + 1} of {totalSteps}
                    </Text>
                    <Text variant="bodySm" as="p" tone="subdued">
                      {Math.round(progress)}% complete
                    </Text>
                  </InlineStack>
                  <ProgressBar progress={progress} size="small" />
                </BlockStack>
              </Box>
            )}

            <form ref={formRef} onSubmit={handleFormSubmit}>
              {/* Hidden inputs to store all form data */}
              <input type="hidden" name="name" value={formData.name} />
              <input type="hidden" name="email" value={formData.email} />
              <input type="hidden" name="company" value={formData.company} />
              <input type="hidden" name="website" value={formData.website} />
              <input type="hidden" name="platform" value={formData.platform} />
              <input type="hidden" name="teamSize" value={formData.teamSize} />
              <input type="hidden" name="monthlyRevenue" value={formData.monthlyRevenue} />
              <input type="hidden" name="budget" value={formData.budget} />
              <input type="hidden" name="projectType" value={formData.projectType.join(', ')} />
              <input type="hidden" name="timeline" value={formData.timeline} />
              <input type="hidden" name="message" value={formData.message} />
              
              {renderStepContent()}
            </form>
          </BlockStack>
        </div>
      </Modal.Section>
    </Modal>
  );
};