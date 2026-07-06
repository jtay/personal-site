export const panel: React.CSSProperties = {
  background: 'var(--cb-color-panel)',
  border: '1px solid var(--cb-color-border)',
  borderRadius: 'var(--cb-radius)',
  padding: 12
};

export const sectionTitle: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: 0.4,
  color: 'var(--cb-color-muted)',
  marginBottom: 8
};

export const input: React.CSSProperties = {
  width: '100%',
  padding: '6px 8px',
  border: '1px solid var(--cb-color-border)',
  borderRadius: 4,
  fontSize: 13
};

export const button: React.CSSProperties = {
  padding: '6px 12px',
  borderRadius: 4,
  border: '1px solid var(--cb-color-border)',
  background: '#fff',
  fontSize: 13,
  cursor: 'pointer'
};

export const buttonPrimary: React.CSSProperties = {
  ...button,
  background: 'var(--cb-color-accent)',
  borderColor: 'var(--cb-color-accent)',
  color: '#fff'
};
