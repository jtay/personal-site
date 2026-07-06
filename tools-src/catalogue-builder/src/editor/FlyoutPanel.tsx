import { IconX } from '../components/icons';

interface FlyoutPanelProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

export const FlyoutPanel: React.FC<FlyoutPanelProps> = ({ title, onClose, children }) => (
  <div className="cb-flyout">
    <div className="cb-flyout-header">
      <span>{title}</span>
      <button aria-label="Close panel" onClick={onClose} className="cb-flyout-close">
        <IconX size={15} />
      </button>
    </div>
    <div className="cb-flyout-body">{children}</div>
  </div>
);
