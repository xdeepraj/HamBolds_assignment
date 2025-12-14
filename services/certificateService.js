import { createCanvas, loadImage } from "canvas";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const createTemplateIfNotExists = async () => {
  const templatePath = path.join(
    __dirname,
    "../templates/certificate-template.jpg"
  );

  // Ensure templates directory exists
  const templatesDir = path.dirname(templatePath);
  if (!fs.existsSync(templatesDir)) {
    fs.mkdirSync(templatesDir, { recursive: true });
  }

  if (!fs.existsSync(templatePath)) {
    // Create a basic certificate template
    const width = 1200;
    const height = 800;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext("2d");

    // Background - light beige/cream color
    ctx.fillStyle = "#F5F5DC";
    ctx.fillRect(0, 0, width, height);

    // Border
    ctx.strokeStyle = "#8B4513";
    ctx.lineWidth = 10;
    ctx.strokeRect(50, 50, width - 100, height - 100);

    // Inner border
    ctx.strokeStyle = "#D2691E";
    ctx.lineWidth = 3;
    ctx.strokeRect(70, 70, width - 140, height - 140);

    // Title
    ctx.fillStyle = "#8B4513";
    ctx.font = "bold 48px Arial";
    ctx.textAlign = "center";
    ctx.fillText("CERTIFICATE", width / 2, 180);

    // Subtitle
    ctx.fillStyle = "#654321";
    ctx.font = "32px Arial";
    ctx.fillText("This is to certify that", width / 2, 250);

    // Decorative lines
    ctx.strokeStyle = "#8B4513";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(200, 280);
    ctx.lineTo(500, 280);
    ctx.moveTo(700, 280);
    ctx.lineTo(1000, 280);
    ctx.stroke();

    // Labels (will be filled by actual data)
    ctx.fillStyle = "#333";
    ctx.font = "bold 28px Arial";
    ctx.textAlign = "left";
    ctx.fillText("Name:", 250, 420);
    ctx.fillText("Business Name:", 250, 480);
    ctx.fillText("GST Number:", 250, 540);
    ctx.fillText("Business Address:", 250, 600);

    // Footer
    ctx.fillStyle = "#666";
    ctx.font = "20px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Authorized Signature", width / 2, height - 100);

    // Save the template
    const buffer = canvas.toBuffer("image/jpeg");
    fs.writeFileSync(templatePath, buffer);
  }

  return templatePath;
};

export const createCertificateImage = async (data) => {
  const templatePath = await createTemplateIfNotExists();

  const image = await loadImage(templatePath);

  const canvas = createCanvas(image.width, image.height);
  const ctx = canvas.getContext("2d");

  ctx.drawImage(image, 0, 0);

  ctx.fillStyle = "#000";
  ctx.font = "32px Arial";
  ctx.textAlign = "left";

  ctx.fillText(data.name, 400, 420);
  ctx.fillText(data.businessName, 400, 480);
  ctx.fillText(data.gstNumber, 400, 540);
  ctx.fillText(data.businessAddress, 400, 600);

  const outputDir = path.join(__dirname, "../output");
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const outputPath = path.join(
    outputDir,
    `certificate_${Date.now()}.jpg`
  );

  fs.writeFileSync(outputPath, canvas.toBuffer("image/jpeg"));

  return outputPath;
};
