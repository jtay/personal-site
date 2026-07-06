export const panel: React.CSSProperties = {
  background: 'var(--cb-color-panel)',
  border: '1px solid var(--cb-color-border)',
  borderRadius: 'var(--cb-radius)',
  padding: 'var(--cb-space-3)'
};

export const sectionTitle: React.CSSProperties = {
  fontSize: 'var(--cb-font-xs)',
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: 0.4,
  color: 'var(--cb-color-muted)',
  marginBottom: 'var(--cb-space-2)'
};

export const input: React.CSSProperties = {
  width: '100%',
  padding: 'var(--cb-space-2) var(--cb-space-2)',
  border: '1px solid var(--cb-color-border)',
  borderRadius: 4,
  fontSize: 'var(--cb-font-base)'
};

export const button: React.CSSProperties = {
  padding: 'var(--cb-space-2) var(--cb-space-3)',
  borderRadius: 4,
  border: '1px solid var(--cb-color-border)',
  background: '#fff',
  fontSize: 'var(--cb-font-base)',
  cursor: 'pointer'
};

export const buttonPrimary: React.CSSProperties = {
  ...button,
  background: 'var(--cb-color-accent)',
  borderColor: 'var(--cb-color-accent)',
  color: '#fff'
};
