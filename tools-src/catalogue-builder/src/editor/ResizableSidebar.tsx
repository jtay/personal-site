import { useRef } from 'react';

export interface ResizableSidebarProps {
  width: number;
  onResize: (width: number) => void;
  minWidth: number;
  maxWidth: number;
  /** Which edge the drag handle sits on - the edge touching the center canvas. */
  handleSide: 'left' | 'right';
  borderStyle: React.CSSProperties;
  children: React.ReactNode;
}

/** A sidebar column with a drag handle on its inner edge, persisted width lives in the parent (App). */
export const ResizableSidebar: React.FC<ResizableSidebarProps> = ({
  width,
  onResize,
  minWidth,
  maxWidth,
  handleSide,
  borderStyle,
  children
}) => {
  const dragState = useRef<{ startX: number; startWidth: number } | null>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    dragState.current = { startX: e.clientX, startWidth: width };

    const onMove = (moveEvent: MouseEvent) => {
      if (!dragState.current) return;
      const delta = moveEvent.clientX - dragState.current.startX;
      const signedDelta = handleSide === 'right' ? delta : -delta;
      const next = Math.min(maxWidth, Math.max(minWidth, dragState.current.startWidth + signedDelta));
      onResize(next);
    };
    const onUp = () => {
      dragState.current = null;
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  };

  return (
    <div style={{ position: 'relative', minHeight: 0, minWidth: 0, ...borderStyle }}>
      <div style={{ height: '100%', overflowY: 'auto', padding: 12, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {children}
      </div>
      <div
        onMouseDown={handleMouseDown}
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          [handleSide]: -3,
          width: 6,
          cursor: 'col-resize',
          zIndex: 1
        }}
      />
    </div>
  );
};
