import { useState, useCallback, useRef, useEffect } from 'react';
import validator from 'validator';
import {
  Modal,
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

interface FieldErrors {
  [key: string]: string;
}

interface SteppedContactFormModalProps {
  active: boolean;
  onClose: () => void;
}

const INITIAL_FORM_DATA: FormData = {
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
};

const PLATFORM_OPTIONS = [
  { label: 'Select platform', value: '' },
  { label: 'Shopify', value: 'Shopify' },
  { label: 'Shopify Plus', value: 'Shopify Plus' },
  { label: 'Other Platform (Migration)', value: 'Other Platform (Migration)' },
  { label: 'New Store', value: 'New Store' },
];

const BUDGET_OPTIONS = [
  { label: 'Select project budget', value: '' },
  { label: 'Unsure / Just exploring', value: 'Unsure / Just exploring' },
  { label: 'Under £1k', value: 'Under £1k' },
  { label: '£1k - £4k', value: '£1k - £4k' },
  { label: '£5k - £9k', value: '£5k - £9k' },
  { label: '£10k - £49k', value: '£10k - £49k' },
  { label: '£50k - £99k', value: '£50k - £99k' },
  { label: '£100k+', value: '£100k+' },
];

const TEAM_SIZE_OPTIONS = [
  { label: 'Select team size', value: '' },
  { label: 'Just me', value: 'Just me' },
  { label: '2-5', value: '2-5' },
  { label: '6-10', value: '6-10' },
  { label: '11-25', value: '11-25' },
  { label: '26-50', value: '26-50' },
  { label: '50+', value: '50+' },
];

const REVENUE_OPTIONS = [
  { label: 'Select monthly revenue', value: '' },
  { label: 'Pre-launch', value: 'Pre-launch' },
  { label: 'Under £4k', value: 'Under £4k' },
  { label: '£5k - £9k', value: '£5k - £9k' },
  { label: '£10k - £49k', value: '£10k - £49k' },
  { label: '£50k - £99k', value: '£50k - £99k' },
  { label: '£100k - £499k', value: '£100k - £499k' },
  { label: '£500k+', value: '£500k+' },
];

const TIMELINE_OPTIONS = [
  { label: 'Select desired timeline', value: '' },
  { label: 'Just exploring', value: 'Just exploring' },
  { label: 'ASAP', value: 'ASAP' },
  { label: 'Within 1 month', value: 'Within 1 month' },
  { label: '1-3 months', value: '1-3 months' },
  { label: '3-6 months', value: '3-6 months' },
];

const PROJECT_TYPE_OPTIONS = [
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
];

const STEP_CONFIG = [
  {
    title: "Let's start with your details",
    subtitle: 'Tell me a bit about yourself and your company',
  },
  {
    title: 'Project details',
    subtitle: 'Help me understand your current setup and budget',
  },
  {
    title: 'What do you need help with?',
    subtitle: 'Select all that apply',
  },
  {
    title: 'Timeline and project details',
    subtitle: 'When do you need this completed and what are your goals?',
  },
];

// Helper function to validate URL format
const isValidURL = (urlString: string): boolean => {
  if (!urlString) return true; // Empty is valid (optional field)
  
  // Check if it's a valid URL using validator library
  // Allow both with and without protocol
  const hasProtocol = /^https?:\/\//i.test(urlString);
  const urlToValidate = hasProtocol ? urlString : `https://${urlString}`;
  
  return validator.isURL(urlToValidate, {
    protocols: ['http', 'https'],
    require_protocol: false,
    require_valid_protocol: true,
  });
};

// Helper function to normalize URL with protocol
const normalizeURL = (urlString: string): string => {
  if (!urlString) return '';
  
  const trimmed = urlString.trim();
  
  // If already has http:// or https://, return as is
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }
  
  // Otherwise, add https://
  return `https://${trimmed}`;
};

export const HomepageContactForm = ({ active, onClose }: SteppedContactFormModalProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [submitError, setSubmitError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  
  const modalContentRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const totalSteps = STEP_CONFIG.length;
  const progress = ((currentStep + 1) / totalSteps) * 100;

  // Scroll to top when step changes
  useEffect(() => {
    modalContentRef.current?.scrollTo(0, 0);
  }, [currentStep]);

  // Reset form when modal closes
  useEffect(() => {
    if (!active) {
      setCurrentStep(0);
      setFieldErrors({});
      setSubmitError('');
      setSubmitSuccess(false);
      setFormData(INITIAL_FORM_DATA);
    }
  }, [active]);

  const handleFieldChange = useCallback((field: keyof FormData) => (value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear field error when user starts typing
    if (fieldErrors[field]) {
      setFieldErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
    
    // Real-time validation for email
    if (field === 'email') {
      if (value && !validator.isEmail(value)) {
        setFieldErrors(prev => ({ ...prev, email: 'Please enter a valid email address' }));
      }
    }
    
    // Real-time validation for website
    if (field === 'website') {
      if (value && !isValidURL(value)) {
        setFieldErrors(prev => ({ ...prev, website: 'Please enter a valid URL' }));
      }
    }
  }, [fieldErrors]);

  const handleCheckboxChange = useCallback((option: string) => (checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      projectType: checked
        ? [...prev.projectType, option]
        : prev.projectType.filter(item => item !== option)
    }));
  }, []);

  const validateStep = useCallback((step: number): boolean => {
    switch (step) {
      case 0:
        return !!(
          formData.name && 
          formData.email && 
          validator.isEmail(formData.email) && 
          formData.company &&
          (!formData.website || isValidURL(formData.website)) &&
          !fieldErrors.email &&
          !fieldErrors.website
        );
      case 1:
        return !!(formData.platform && formData.budget);
      case 2:
        return formData.projectType.length > 0;
      case 3:
        return !!(formData.timeline && formData.message);
      default:
        return false;
    }
  }, [formData, fieldErrors]);

  const handleNext = useCallback(() => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(prev => prev + 1);
    }
  }, [currentStep, totalSteps]);

  const handleBack = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      setSubmitError('');
    }
  }, [currentStep]);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    setFieldErrors({});
    setIsSubmitting(true);

    try {
      const formUrl = import.meta.env.VITE_FORM_URL;
      
      if (!formUrl) {
        throw new Error('Form URL is not configured');
      }

      // Normalize the website URL before submission
      const normalizedWebsite = formData.website ? normalizeURL(formData.website) : '';

      // Create FormData object
      const formDataToSubmit = new FormData();
      formDataToSubmit.append('name', formData.name);
      formDataToSubmit.append('email', formData.email);
      formDataToSubmit.append('company', formData.company);
      formDataToSubmit.append('website', normalizedWebsite);
      formDataToSubmit.append('platform', formData.platform);
      formDataToSubmit.append('teamSize', formData.teamSize);
      formDataToSubmit.append('monthlyRevenue', formData.monthlyRevenue);
      formDataToSubmit.append('budget', formData.budget);
      formDataToSubmit.append('projectType', formData.projectType.join(', '));
      formDataToSubmit.append('timeline', formData.timeline);
      formDataToSubmit.append('message', formData.message);

      const response = await fetch(formUrl, {
        method: 'POST',
        body: formDataToSubmit,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        setSubmitSuccess(true);
        setFormData(INITIAL_FORM_DATA);
      } else {
        const data = await response.json();
        
        if (data && typeof data === 'object' && 'errors' in data && Array.isArray(data.errors)) {
          // Build field-specific errors object
          const errors: FieldErrors = {};
          data.errors.forEach((error: any) => {
            if (error.field && error.message) {
              errors[error.field] = error.message;
            }
          });
          
          // Set field errors
          setFieldErrors(errors);
          
          // Set general error message
          const errorMessages = data.errors
            .map((error: any) => `${error.field}: ${error.message}`)
            .join(', ');
          setSubmitError('Please review the errors below and try again.');
          
          // Navigate back to step 0 to show errors
          setCurrentStep(0);
        } else {
          setSubmitError('Oops! There was a problem submitting your form');
        }
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitError('Oops! There was a problem submitting your form');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPrimaryAction = () => {
    if (submitSuccess) {
      return { content: 'Close', onAction: onClose };
    }

    if (currentStep === totalSteps - 1) {
      return {
        content: 'Send Inquiry',
        onAction: () => formRef.current?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true })),
        loading: isSubmitting,
        disabled: isSubmitting || !validateStep(currentStep),
      };
    }

    return {
      content: 'Next',
      onAction: handleNext,
      disabled: !validateStep(currentStep),
    };
  };

  const getSecondaryActions = () => {
    if (submitSuccess) return [];
    
    return currentStep === 0
      ? [{ content: 'Cancel', onAction: onClose }]
      : [{ content: 'Back', onAction: handleBack }];
  };

  const renderStepContent = () => {
    if (submitSuccess) {
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

    const stepConfig = STEP_CONFIG[currentStep];

    return (
      <BlockStack gap="400">
        <BlockStack gap="200">
          <Text variant="headingMd" as="h3">
            {stepConfig.title}
          </Text>
          <Text variant="bodyMd" as="p" tone="subdued">
            {stepConfig.subtitle}
          </Text>
        </BlockStack>

        {submitError && (
          <Banner tone="critical">
            <p>{submitError}</p>
          </Banner>
        )}

        {currentStep === 0 && (
          <>
            <TextField
              label="Full Name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleFieldChange('name')}
              autoComplete="name"
              requiredIndicator
              prefix={<Icon source={PersonIcon} />}
              error={fieldErrors.name}
            />

            <TextField
              label="Email Address"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleFieldChange('email')}
              autoComplete="email"
              requiredIndicator
              error={fieldErrors.email}
              prefix={<Icon source={EmailIcon} />}
            />

            <TextField
              label="Company Name"
              type="text"
              name="company"
              value={formData.company}
              onChange={handleFieldChange('company')}
              autoComplete="organization"
              requiredIndicator
              prefix={<Icon source={StoreIcon} />}
              error={fieldErrors.company}
            />

            <TextField
              label="Current Website (optional)"
              type="url"
              name="website"
              value={formData.website}
              onChange={handleFieldChange('website')}
              autoComplete="url"
              prefix={<Icon source={GlobeIcon} />}
              error={fieldErrors.website}
              helpText="Enter your website URL (e.g., example.com or https://example.com)"
            />
          </>
        )}

        {currentStep === 1 && (
          <>
            <Select
              label="Current Platform"
              options={PLATFORM_OPTIONS}
              name="platform"
              value={formData.platform}
              onChange={handleFieldChange('platform')}
              requiredIndicator
              error={fieldErrors.platform}
            />

            <Select
              label="Project Budget"
              options={BUDGET_OPTIONS}
              name="budget"
              value={formData.budget}
              onChange={handleFieldChange('budget')}
              requiredIndicator
              error={fieldErrors.budget}
            />

            <Select
              label="Team Size (optional)"
              options={TEAM_SIZE_OPTIONS}
              name="teamSize"
              value={formData.teamSize}
              onChange={handleFieldChange('teamSize')}
              error={fieldErrors.teamSize}
            />

            <Select
              label="Monthly Revenue (optional)"
              options={REVENUE_OPTIONS}
              name="monthlyRevenue"
              value={formData.monthlyRevenue}
              onChange={handleFieldChange('monthlyRevenue')}
              error={fieldErrors.monthlyRevenue}
            />
          </>
        )}

        {currentStep === 2 && (
          <BlockStack gap="300">
            {fieldErrors.projectType && (
              <Banner tone="critical">
                <p>{fieldErrors.projectType}</p>
              </Banner>
            )}
            <Grid>
              {PROJECT_TYPE_OPTIONS.map((option) => (
                <Grid.Cell key={option} columnSpan={{ xs: 6, sm: 6, md: 6, lg: 6, xl: 6 }}>
                  <Checkbox
                    label={option}
                    checked={formData.projectType.includes(option)}
                    onChange={handleCheckboxChange(option)}
                  />
                </Grid.Cell>
              ))}
            </Grid>
          </BlockStack>
        )}

        {currentStep === 3 && (
          <>
            <Select
              label="Desired Timeline"
              options={TIMELINE_OPTIONS}
              name="timeline"
              value={formData.timeline}
              onChange={handleFieldChange('timeline')}
              requiredIndicator
              error={fieldErrors.timeline}
            />

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
              error={fieldErrors.message}
            />
          </>
        )}
      </BlockStack>
    );
  };

  return (
    <Modal
      open={active}
      onClose={onClose}
      title={submitSuccess ? "Success!" : "Let's Build Something Amazing"}
      primaryAction={getPrimaryAction()}
      secondaryActions={getSecondaryActions()}
      size="large"
    >
      <Modal.Section>
        <div ref={modalContentRef}>
          <BlockStack gap="400">
            {!submitSuccess && (
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
              {renderStepContent()}
            </form>
          </BlockStack>
        </div>
      </Modal.Section>
    </Modal>
  );
};