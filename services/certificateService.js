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
    // A4 Landscape dimensions at 300 DPI (better quality)
    // A4 Landscape: 3508 x 2480 pixels at 300 DPI
    const width = 3508;
    const height = 2480;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext("2d");

    // Background - light beige/cream color
    ctx.fillStyle = "#F5F5DC";
    ctx.fillRect(0, 0, width, height);

    // Outer border (thick decorative border)
    ctx.strokeStyle = "#8B4513";
    ctx.lineWidth = 30;
    ctx.strokeRect(75, 75, width - 150, height - 150);

    // Inner border (decorative double border effect)
    ctx.strokeStyle = "#D2691E";
    ctx.lineWidth = 8;
    ctx.strokeRect(120, 120, width - 240, height - 240);

    // Title - CERTIFICATE (large and centered)
    ctx.fillStyle = "#8B4513";
    ctx.font = "bold 180px 'Times New Roman', serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("GST CERTIFICATE", width / 2, 450);

    // Decorative line under title
    ctx.strokeStyle = "#8B4513";
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(width / 2 - 400, 550);
    ctx.lineTo(width / 2 + 400, 550);
    ctx.stroke();

    // Standard certificate text
    ctx.fillStyle = "#2C3E50";
    ctx.font = "italic 80px 'Times New Roman', serif";
    ctx.textAlign = "center";
    ctx.fillText("This is to certify that", width / 2, 750);

    // Standard continuation text
    ctx.fillStyle = "#34495E";
    ctx.font = "60px 'Times New Roman', serif";
    ctx.fillText(
      "has been registered with GST and is a recognized business entity",
      width / 2,
      1050
    );
    ctx.fillText("under the Goods and Services Tax Act.", width / 2, 1150);

    // Footer with signature and date placeholder area
    ctx.fillStyle = "#666";
    ctx.font = "50px 'Times New Roman', serif";

    // Signature line - left side
    ctx.textAlign = "left";
    ctx.fillText("Authorized Signature", width / 2 - 400, height - 250);
    ctx.strokeStyle = "#666";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(width / 2 - 400, height - 180);
    ctx.lineTo(width / 2 - 100, height - 180);
    ctx.stroke();

    // Date line - right side
    ctx.textAlign = "right";
    ctx.fillText("Date:", width / 2 + 400, height - 250);
    ctx.strokeStyle = "#666";
    ctx.beginPath();
    ctx.moveTo(width / 2 + 100, height - 180);
    ctx.lineTo(width / 2 + 400, height - 180);
    ctx.stroke();

    // Save the template
    const buffer = canvas.toBuffer("image/jpeg", { quality: 0.95 });
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

  // Calculate positions based on canvas dimensions (A4 Landscape)
  const width = canvas.width;
  const startX = width / 2;
  const nameY = 900;
  const businessNameY = 1400;
  const gstY = 1600;
  const addressY = 1800;
  const lineHeight = 100;

  // Name (centered, bold, larger)
  ctx.fillStyle = "#1A1A1A";
  ctx.font = "bold 100px 'Times New Roman', serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(data.name, startX, nameY);

  // Business Name label and value
  ctx.fillStyle = "#2C3E50";
  ctx.font = "bold 70px 'Times New Roman', serif";
  ctx.textAlign = "left";
  const labelX = width / 2 - 600;
  ctx.fillText("Business Name:", labelX, businessNameY);

  ctx.fillStyle = "#1A1A1A";
  ctx.font = "70px 'Times New Roman', serif";
  const valueX = width / 2 + 100;
  ctx.fillText(data.businessName, valueX, businessNameY);

  // GST Number label and value
  ctx.fillStyle = "#2C3E50";
  ctx.font = "bold 70px 'Times New Roman', serif";
  ctx.fillText("GST Number:", labelX, gstY);

  ctx.fillStyle = "#1A1A1A";
  ctx.font = "70px 'Times New Roman', serif";
  ctx.fillText(data.gstNumber, valueX, gstY);

  // Business Address label and value (handle multi-line if needed)
  ctx.fillStyle = "#2C3E50";
  ctx.font = "bold 70px 'Times New Roman', serif";
  ctx.fillText("Business Address:", labelX, addressY);

  ctx.fillStyle = "#1A1A1A";
  ctx.font = "70px 'Times New Roman', serif";

  // Multi-line address wrapping
  const maxWidth = 1400; // Maximum width for address text
  const words = data.businessAddress.split(" ");
  const lines = [];
  let currentLine = "";

  for (let i = 0; i < words.length; i++) {
    const testLine = currentLine ? currentLine + " " + words[i] : words[i];
    const metrics = ctx.measureText(testLine);

    if (metrics.width > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = words[i];
    } else {
      currentLine = testLine;
    }
  }
  if (currentLine) {
    lines.push(currentLine);
  }

  // Draw each line of the address
  lines.forEach((line, index) => {
    ctx.fillText(line, valueX, addressY + index * lineHeight);
  });

  const outputDir = path.join(__dirname, "../output");
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
    console.log("Created output directory:", outputDir);
  }

  const outputPath = path.join(outputDir, `certificate_${Date.now()}.jpg`);

  try {
    fs.writeFileSync(outputPath, canvas.toBuffer("image/jpeg"));
    console.log("Certificate image saved to:", outputPath);
  } catch (error) {
    console.error("Error saving certificate image:", error);
    throw error;
  }

  return outputPath;
};
