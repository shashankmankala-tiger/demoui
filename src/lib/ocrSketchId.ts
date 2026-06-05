"use client";

import Tesseract from "tesseract.js";

/**
 * Crops the top strip of an image (where the style ID label sits)
 * and runs OCR to extract the ID pattern (e.g. "C117295602").
 * Returns null if no ID is found.
 */
export async function ocrSketchId(dataUrl: string): Promise<string | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = async () => {
      // Crop top 80px — that's where "ID: CXXXXXXXXX" lives
      const cropHeight = Math.min(80, img.height);
      const canvas = document.createElement("canvas");
      canvas.width  = img.width;
      canvas.height = cropHeight;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, img.width, cropHeight, 0, 0, img.width, cropHeight);

      try {
        const { data: { text } } = await Tesseract.recognize(canvas, "eng", {
          // Treat as a single line — faster and more accurate for a label
          // @ts-expect-error tesseract config
          tessedit_pageseg_mode: "7",
        });
        // Extract style ID pattern: C followed by digits
        const match = text.match(/C\d{6,}/);
        resolve(match ? match[0] : null);
      } catch {
        resolve(null);
      }
    };
    img.onerror = () => resolve(null);
    img.src = dataUrl;
  });
}
