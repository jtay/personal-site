import { useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import JsBarcode from 'jsbarcode';
import type { CodeGraphicType } from '../domain/code';

export interface CodeGraphicProps {
  type: CodeGraphicType;
  /** The already-resolved string to encode, or null when there's nothing to show yet. */
  value: string | null;
  /** Rendered box size in px for QR (square) or height in px for barcode. */
  size?: number;
}

/**
 * Single rendering surface for both code types so the page-level "code" slot and the
 * withCode() product-card composition never diverge in how a QR/barcode actually looks.
 */
// Pages export at A4/96 CSS-px sizing but print at >=300dpi; a QR canvas rasterized to
// match its small on-screen CSS size would look soft once printed larger than 96dpi. This
// renders the bitmap ~4x denser than the CSS box and lets the browser downscale it for
// display, so print output stays crisp at the smaller physical size the card now uses.
const PRINT_RASTER_SCALE = 4;

export const CodeGraphic: React.FC<CodeGraphicProps> = ({ type, value, size = 96 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!value) return;
    if (type === 'qr' && canvasRef.current) {
      const rasterSize = Math.round(size * PRINT_RASTER_SCALE);
      QRCode.toCanvas(canvasRef.current, value, { width: rasterSize, margin: 1 })
        .then(() => {
          if (canvasRef.current) {
            canvasRef.current.style.width = `${size}px`;
            canvasRef.current.style.height = `${size}px`;
          }
        })
        .catch(() => {
          // Invalid/oversized input for a QR payload - leave the canvas blank rather than crash.
        });
    }
    if (type === 'barcode' && svgRef.current) {
      try {
        // Code-128 renders as vector <path> elements, so it stays crisp at print DPI without
        // needing the raster-scale trick QR needs. JsBarcode sizes its own intrinsic width
        // from the encoded value's bar count, which can be wider than the card; a viewBox
        // matching that native size plus a CSS width cap is what lets a long value scale
        // down losslessly to fit instead of overflowing the card.
        const svg = svgRef.current;
        JsBarcode(svg, value, { format: 'CODE128', height: size * 0.5, displayValue: false, margin: 0 });
        const nativeWidth = parseFloat(svg.getAttribute('width') ?? '');
        const nativeHeight = parseFloat(svg.getAttribute('height') ?? '');
        if (nativeWidth && nativeHeight) {
          svg.setAttribute('viewBox', `0 0 ${nativeWidth} ${nativeHeight}`);
        }
        svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
        svg.removeAttribute('width');
        svg.removeAttribute('height');
        svg.style.display = 'block';
        svg.style.width = '100%';
        svg.style.height = `${size * 0.5}px`;
      } catch {
        // Code-128 can't encode some characters - leave the svg blank rather than crash.
      }
    }
  }, [type, value, size]);

  if (!value) {
    return (
      <div
        style={{
          width: type === 'qr' ? size : size * 2,
          height: type === 'qr' ? size : size * 0.5,
          border: '1px dashed #ccc',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 9,
          color: '#999',
          textAlign: 'center'
        }}
      >
        No data
      </div>
    );
  }

  return type === 'qr' ? <canvas ref={canvasRef} /> : <svg ref={svgRef} />;
};
