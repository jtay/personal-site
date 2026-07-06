/**
 * A4 at a print-safe 200dpi is ~1654x2339px. We cap any single uploaded image to that
 * long edge so a full-bleed cover image never exceeds print resolution, and generate a
 * small preview copy so the editor canvas stays smooth with many images on screen.
 */
const PRINT_MAX_DIMENSION = 2000;
const PREVIEW_MAX_DIMENSION = 500;

async function loadImage(file: File): Promise<HTMLImageElement> {
  const url = URL.createObjectURL(file);
  try {
    const img = new Image();
    img.src = url;
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error('Could not read image file.'));
    });
    return img;
  } finally {
    URL.revokeObjectURL(url);
  }
}

function drawScaled(img: HTMLImageElement, maxDimension: number): string {
  const scale = Math.min(1, maxDimension / Math.max(img.naturalWidth, img.naturalHeight));
  const width = Math.round(img.naturalWidth * scale);
  const height = Math.round(img.naturalHeight * scale);

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D context unavailable.');
  ctx.drawImage(img, 0, 0, width, height);
  return canvas.toDataURL('image/jpeg', 0.85);
}

export interface ProcessedImage {
  previewDataUrl: string;
  printDataUrl: string;
  width: number;
  height: number;
}

export async function processUploadedImage(file: File): Promise<ProcessedImage> {
  const img = await loadImage(file);
  return {
    previewDataUrl: drawScaled(img, PREVIEW_MAX_DIMENSION),
    printDataUrl: drawScaled(img, PRINT_MAX_DIMENSION),
    width: img.naturalWidth,
    height: img.naturalHeight
  };
}
