interface IconProps {
  size?: number;
}

const base = (size: number) => ({
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const
});

export const IconPackage: React.FC<IconProps> = ({ size = 18 }) => (
  <svg {...base(size)}>
    <path d="M3 8l9-5 9 5-9 5-9-5z" />
    <path d="M3 8v8l9 5 9-5V8" />
    <path d="M12 13v8" />
  </svg>
);

export const IconLayout: React.FC<IconProps> = ({ size = 18 }) => (
  <svg {...base(size)}>
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path d="M3 9h18" />
    <path d="M9 9v12" />
  </svg>
);

export const IconPalette: React.FC<IconProps> = ({ size = 18 }) => (
  <svg {...base(size)}>
    <path d="M12 3a9 9 0 1 0 0 18c1.1 0 2-.9 2-2 0-.5-.2-1-.5-1.4-.3-.4-.5-.9-.5-1.4 0-1.1.9-2 2-2h2.3A4.2 4.2 0 0 0 21 12a9 9 0 0 0-9-9z" />
    <circle cx="7.5" cy="10.5" r="1" fill="currentColor" />
    <circle cx="11" cy="7" r="1" fill="currentColor" />
    <circle cx="15.5" cy="7.5" r="1" fill="currentColor" />
  </svg>
);

export const IconPlug: React.FC<IconProps> = ({ size = 18 }) => (
  <svg {...base(size)}>
    <path d="M9 3v5M15 3v5" />
    <path d="M6 8h12v3a6 6 0 0 1-12 0V8z" />
    <path d="M12 17v4" />
  </svg>
);

export const IconUndo: React.FC<IconProps> = ({ size = 16 }) => (
  <svg {...base(size)}>
    <path d="M4 10h11a5 5 0 1 1 0 10h-2" />
    <path d="M9 5 4 10l5 5" />
  </svg>
);

export const IconRedo: React.FC<IconProps> = ({ size = 16 }) => (
  <svg {...base(size)}>
    <path d="M20 10H9a5 5 0 1 0 0 10h2" />
    <path d="M15 5l5 5-5 5" />
  </svg>
);

export const IconChevronLeft: React.FC<IconProps> = ({ size = 16 }) => (
  <svg {...base(size)}>
    <path d="M15 5l-7 7 7 7" />
  </svg>
);

export const IconChevronRight: React.FC<IconProps> = ({ size = 16 }) => (
  <svg {...base(size)}>
    <path d="M9 5l7 7-7 7" />
  </svg>
);

export const IconX: React.FC<IconProps> = ({ size = 16 }) => (
  <svg {...base(size)}>
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
);

export const IconPlus: React.FC<IconProps> = ({ size = 16 }) => (
  <svg {...base(size)}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export const IconSearch: React.FC<IconProps> = ({ size = 16 }) => (
  <svg {...base(size)}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </svg>
);

export const IconGrip: React.FC<IconProps> = ({ size = 14 }) => (
  <svg {...base(size)} fill="currentColor" stroke="none">
    <circle cx="9" cy="6" r="1.4" />
    <circle cx="15" cy="6" r="1.4" />
    <circle cx="9" cy="12" r="1.4" />
    <circle cx="15" cy="12" r="1.4" />
    <circle cx="9" cy="18" r="1.4" />
    <circle cx="15" cy="18" r="1.4" />
  </svg>
);

export const IconCommand: React.FC<IconProps> = ({ size = 14 }) => (
  <svg {...base(size)}>
    <path d="M9 3a3 3 0 0 0-3 3v12a3 3 0 1 0 3-3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3v12a3 3 0 1 0 3-3H6" />
  </svg>
);

export const IconCopy: React.FC<IconProps> = ({ size = 14 }) => (
  <svg {...base(size)}>
    <rect x="9" y="9" width="12" height="12" rx="2" />
    <path d="M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1" />
  </svg>
);

export const IconTrash: React.FC<IconProps> = ({ size = 14 }) => (
  <svg {...base(size)}>
    <path d="M4 7h16" />
    <path d="M6 7l1 13a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-13" />
    <path d="M9 7V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3" />
  </svg>
);
