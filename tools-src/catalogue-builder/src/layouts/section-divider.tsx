import type { LayoutDefinition, LayoutRenderProps } from './types';

const SectionDividerLayout: React.FC<LayoutRenderProps> = ({ slots }) => {
  const heading = slots.heading?.type === 'text' ? slots.heading.value : '';
  const subheading = slots.subheading?.type === 'text' ? slots.subheading.value : '';

  return (
    <div
      className="cb-page-a4"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        background: 'var(--theme-color-primary)',
        color: '#fff',
        gap: 12,
        padding: '0 60px'
      }}
    >
      {heading && <h1 style={{ fontSize: 40, margin: 0, letterSpacing: 2, textTransform: 'uppercase' }}>{heading}</h1>}
      {subheading && <p style={{ fontSize: 15, margin: 0, opacity: 0.75 }}>{subheading}</p>}
    </div>
  );
};

/** A minimal section-break/intermediary page - just a heading, useful between chapters of the catalogue. */
export const sectionDividerLayout: LayoutDefinition = {
  id: 'section-divider',
  name: 'Section Divider',
  thumbnail: '',
  slots: [
    { id: 'heading', type: 'text', label: 'Heading', placeholder: 'New Arrivals' },
    { id: 'subheading', type: 'text', label: 'Subheading', placeholder: 'Optional supporting line' }
  ],
  Component: SectionDividerLayout
};
