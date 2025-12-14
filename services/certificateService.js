import { createCanvas, loadImage } from "canvas";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const createCertificateImage = async (data) => {
  const templatePath = path.join(
    __dirname,
    "../templates/certificate-template.jpg"
  );

  const image = await loadImage(templatePath);

  const canvas = createCanvas(image.width, image.height);
  const ctx = canvas.getContext("2d");

  ctx.drawImage(image, 0, 0);

  ctx.fillStyle = "#000";
  ctx.font = "32px Arial";

  ctx.fillText(data.name, 400, 420);
  ctx.fillText(data.businessName, 400, 480);
  ctx.fillText(data.gstNumber, 400, 540);
  ctx.fillText(data.businessAddress, 400, 600);

  const outputPath = path.join(
    __dirname,
    `../output/certificate_${Date.now()}.jpg`
  );

  fs.writeFileSync(outputPath, canvas.toBuffer("image/jpeg"));

  return outputPath;
};
