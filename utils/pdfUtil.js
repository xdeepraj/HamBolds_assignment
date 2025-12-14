import PDFDocument from "pdfkit";
import fs from "fs";

export const createPdfFromImage = (imagePath, pdfPath) => {
  return new Promise((resolve) => {
    const doc = new PDFDocument({ size: "A4" });
    const stream = fs.createWriteStream(pdfPath);

    doc.pipe(stream);
    doc.image(imagePath, 0, 0, { fit: [595, 842] });
    doc.end();

    stream.on("finish", resolve);
  });
};
