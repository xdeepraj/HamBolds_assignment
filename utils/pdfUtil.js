import PDFDocument from "pdfkit";
import fs from "fs";

export const createPdfFromImage = (imagePath, pdfPath) => {
  return new Promise((resolve) => {
    // A4 Landscape: 842 x 595 points (72 DPI)
    const doc = new PDFDocument({ 
      size: [842, 595], // Landscape: width x height
      layout: 'landscape'
    });
    const stream = fs.createWriteStream(pdfPath);

    doc.pipe(stream);
    // Fit image to full page (landscape dimensions)
    doc.image(imagePath, 0, 0, { width: 842, height: 595, fit: [842, 595] });
    doc.end();

    stream.on("finish", resolve);
  });
};
