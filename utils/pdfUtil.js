import PDFDocument from "pdfkit";
import fs from "fs";
import sizeOf from "image-size";

/**
 * Converts a certificate image into a FULL-WIDTH landscape A4 PDF
 */
export const createPdfFromImage = (imagePath, pdfPath) => {
  return new Promise((resolve, reject) => {
    try {
      // Read image dimensions
      const imageBuffer = fs.readFileSync(imagePath);
      const { width, height } = sizeOf(imageBuffer);

      // Decide orientation based on image
      const isLandscape = width > height;

      const pageWidth = isLandscape ? 842 : 595;
      const pageHeight = isLandscape ? 595 : 842;

      const doc = new PDFDocument({
        size: [pageWidth, pageHeight],
        margin: 0,
      });

      const stream = fs.createWriteStream(pdfPath);
      doc.pipe(stream);

      // Draw image to EXACT page size (no cut, no margin)
      doc.image(imagePath, 0, 0, {
        width: pageWidth,
        height: pageHeight,
      });

      doc.end();

      stream.on("finish", resolve);
      stream.on("error", reject);
    } catch (err) {
      reject(err);
    }
  });
};
