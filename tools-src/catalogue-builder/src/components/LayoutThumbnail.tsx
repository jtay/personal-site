import type { SlotSchema } from '../domain/slot';

interface LayoutThumbnailProps {
  slots: SlotSchema[];
  wide?: boolean;
  dark?: boolean;
}

/**
 * Every LayoutDefinition.thumbnail field is currently an empty string (never wired up), so
 * the layout gallery previously showed names with no visual at all. This generates a rough
 * schematic diagram from the slot schema instead of a pixel-perfect render - enough to tell
 * layouts apart at a glance without maintaining a hand-drawn thumbnail per layout.
 */
export const LayoutThumbnail: React.FC<LayoutThumbnailProps> = ({ slots, wide, dark }) => {
  const w = wide ? 140 : 100;
  const h = 76;
  const pad = 6;
  const innerW = w - pad * 2;
  const rowCount = Math.max(slots.length, 1);
  const rowH = (h - pad * 2) / rowCount;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} width="100%" style={{ display: 'block', aspectRatio: `${w} / ${h}` }}>
      <rect x={0.5} y={0.5} width={w - 1} height={h - 1} rx={3} fill={dark ? '#27272a' : '#fafafa'} stroke="#d4d4d8" />
      {slots.map((slot, i) => {
        const y = pad + rowH * i;
        const rowInset = pad + 2;
        const rowW = innerW - 4;
        if (slot.type === 'image' || slot.type === 'product') {
          return <rect key={slot.id} x={rowInset} y={y + 1} width={rowW} height={rowH - 2} rx={2} fill="#d4d4d8" />;
        }
        if (slot.type === 'productGrid') {
          const cols = 3;
          const cellGap = 2;
          const cellW = (rowW - cellGap * (cols - 1)) / cols;
          const cellH = rowH - 2;
          return (
            <g key={slot.id}>
              {Array.from({ length: cols }).map((_, c) => (
                <rect
                  key={c}
                  x={rowInset + c * (cellW + cellGap)}
                  y={y + 1}
                  width={cellW}
                  height={cellH}
                  rx={1.5}
                  fill="#d4d4d8"
                />
              ))}
            </g>
          );
        }
        if (slot.type === 'code') {
          return <rect key={slot.id} x={rowInset} y={y + rowH / 2 - 3} width={7} height={7} rx={1} fill="#a1a1aa" />;
        }
        // text
        const lineH = 2.5;
        return (
          <rect
            key={slot.id}
            x={rowInset}
            y={y + rowH / 2 - lineH / 2}
            width={rowW * 0.7}
            height={lineH}
            rx={1.25}
            fill="#a1a1aa"
          />
        );
      })}
    </svg>
  );
};
