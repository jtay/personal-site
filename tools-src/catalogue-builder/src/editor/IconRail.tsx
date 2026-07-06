import { IconLayout, IconPackage, IconPalette, IconPlug } from '../components/icons';

export type FlyoutId = 'products' | 'layouts' | 'design' | 'connection';

interface IconRailProps {
  active: FlyoutId | null;
  onToggle: (id: FlyoutId) => void;
  connected: boolean;
}

const ITEMS: { id: FlyoutId; label: string; Icon: React.FC<{ size?: number }> }[] = [
  { id: 'products', label: 'Products', Icon: IconPackage },
  { id: 'layouts', label: 'Layouts', Icon: IconLayout },
  { id: 'design', label: 'Design', Icon: IconPalette }
];

/** Slim icon dock that replaces the old two stacked accordion sidebars - opens one flyout at a time so the canvas keeps most of the width by default. */
export const IconRail: React.FC<IconRailProps> = ({ active, onToggle, connected }) => {
  return (
    <div className="cb-icon-rail">
      {ITEMS.map(({ id, label, Icon }) => (
        <button
          key={id}
          className={`cb-icon-rail-btn${active === id ? ' cb-icon-rail-btn--active' : ''}`}
          onClick={() => onToggle(id)}
          aria-label={label}
          title={label}
        >
          <Icon size={18} />
        </button>
      ))}
      <button
        className={`cb-icon-rail-btn cb-icon-rail-btn--bottom${active === 'connection' ? ' cb-icon-rail-btn--active' : ''}`}
        onClick={() => onToggle('connection')}
        aria-label="Store connection"
        title="Store connection"
      >
        <IconPlug size={18} />
        <span className={`cb-icon-rail-dot${connected ? ' cb-icon-rail-dot--on' : ''}`} />
      </button>
    </div>
  );
};
