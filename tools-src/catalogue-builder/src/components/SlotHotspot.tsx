import { useState, type CSSProperties, type ReactNode } from 'react';
import type { ShopifyProduct } from '../domain/product';

interface SlotHotspotProps {
  slotId: string;
  label: string;
  selected?: boolean;
  /** Show a "click to add" affordance when the slot has no content yet (image/product/grid only - text slots already render their own placeholder copy). */
  empty?: boolean;
  emptyHint?: string;
  onSelect?: (slotId: string) => void;
  /** Only passed by layouts for their product/productGrid slots - accepts a product card dragged from the library. */
  onDropProduct?: (slotId: string, product: ShopifyProduct) => void;
  style?: CSSProperties;
  className?: string;
  children?: ReactNode;
}

/**
 * Every layout wraps each slot's rendered region in this so selection happens by clicking
 * the actual content on the canvas, instead of a disconnected row of buttons below it.
 */
export const SlotHotspot: React.FC<SlotHotspotProps> = ({
  slotId,
  label,
  selected,
  empty,
  emptyHint = 'Click to add',
  onSelect,
  onDropProduct,
  style,
  className,
  children
}) => {
  const [dragOver, setDragOver] = useState(false);

  return (
    <div
      className={`cb-slot-hotspot${selected ? ' cb-slot-hotspot--selected' : ''}${dragOver ? ' cb-slot-hotspot--drop-active' : ''}${className ? ` ${className}` : ''}`}
      onClick={(e) => {
        e.stopPropagation();
        onSelect?.(slotId);
      }}
      onDragOver={
        onDropProduct
          ? (e) => {
              e.preventDefault();
              e.dataTransfer.dropEffect = 'copy';
              setDragOver(true);
            }
          : undefined
      }
      onDragLeave={onDropProduct ? () => setDragOver(false) : undefined}
      onDrop={
        onDropProduct
          ? (e) => {
              e.preventDefault();
              setDragOver(false);
              const raw = e.dataTransfer.getData('application/json');
              if (!raw) return;
              try {
                onDropProduct(slotId, JSON.parse(raw) as ShopifyProduct);
              } catch {
                /* not a product drag payload - ignore */
              }
            }
          : undefined
      }
      style={style}
      data-slot-id={slotId}
    >
      {children}
      {empty && (
        <div className="cb-slot-empty-hint">
          <span>{emptyHint}</span>
        </div>
      )}
      {selected && <span className="cb-slot-label">{label}</span>}
    </div>
  );
};
