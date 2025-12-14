import { createCanvas, loadImage, registerFont } from "canvas";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// ------------------------------
// ESM dirname setup
// ------------------------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ------------------------------
// Register custom font
// ------------------------------
registerFont(path.join(__dirname, "../fonts/PlayfairDisplay-Regular.ttf"), {
  family: "Playfair Display",
  weight: "normal",
  style: "normal",
});

registerFont(path.join(__dirname, "../fonts/PlayfairDisplay-Bold.ttf"), {
  family: "Playfair Display",
  weight: "bold",
  style: "normal",
});

registerFont(path.join(__dirname, "../fonts/PlayfairDisplay-Italic.ttf"), {
  family: "Playfair Display",
  weight: "normal",
  style: "italic",
});

registerFont(path.join(__dirname, "../fonts/PlayfairDisplay-BoldItalic.ttf"), {
  family: "Playfair Display",
  weight: "bold",
  style: "italic",
});

// ------------------------------
// Helper: format date
// "15th Dec, 2025 01:23"
// ------------------------------
const formatDateTime = (date) => {
  const day = date.getDate();
  const year = date.getFullYear();
  const month = date.toLocaleString("en-IN", { month: "short" });

  const suffix = (d) => {
    if (d > 3 && d < 21) return "th";
    switch (d % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };

  const hh = String(date.getHours()).padStart(2, "0");
  const mm = String(date.getMinutes()).padStart(2, "0");

  return `${day}${suffix(day)} ${month}, ${year} ${hh}:${mm}`;
};

// ------------------------------
// Create template (NO FOOTER HERE)
// ------------------------------
const createTemplateIfNotExists = async () => {
  const templatePath = path.join(
    __dirname,
    "../templates/certificate-template.jpg"
  );

  if (!fs.existsSync(path.dirname(templatePath))) {
    fs.mkdirSync(path.dirname(templatePath), { recursive: true });
  }

  if (!fs.existsSync(templatePath)) {
    const width = 3508;
    const height = 2480;

    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext("2d");

    // Background
    ctx.fillStyle = "#F5F5DC";
    ctx.fillRect(0, 0, width, height);

    // Borders
    ctx.strokeStyle = "#8B4513";
    ctx.lineWidth = 30;
    ctx.strokeRect(75, 75, width - 150, height - 150);

    ctx.strokeStyle = "#D2691E";
    ctx.lineWidth = 8;
    ctx.strokeRect(120, 120, width - 240, height - 240);

    // Title
    ctx.fillStyle = "#8B4513";
    ctx.font = "bold 180px 'Playfair Display'";
    ctx.textAlign = "center";
    // Title
    const titleText = "GST CERTIFICATE";

    ctx.fillStyle = "#8B4513";
    ctx.font = "bold 180px 'Playfair Display'";
    ctx.textAlign = "center";
    // Title
    const titleY = 420;
    ctx.fillText(titleText, width / 2, titleY);

    // Dynamic underline (closer to title)
    const textMetrics = ctx.measureText(titleText);
    const underlineWidth = textMetrics.width + 40;
    const underlineY = titleY + 45;

    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.moveTo(width / 2 - underlineWidth / 2, underlineY);
    ctx.lineTo(width / 2 + underlineWidth / 2, underlineY);
    ctx.stroke();

    // Subtitle (closer to underline)
    ctx.fillStyle = "#2C3E50";
    ctx.font = "italic 80px 'Playfair Display'";
    ctx.fillText("This is to certify that", width / 2, underlineY + 150);

    ctx.font = "60px 'Playfair Display'";
    ctx.fillStyle = "#34495E";
    ctx.fillText(
      "has been registered with GST and is a recognized business entity",
      width / 2,
      1000
    );
    ctx.fillText("under the Goods and Services Tax Act.", width / 2, 1100);

    fs.writeFileSync(
      templatePath,
      canvas.toBuffer("image/jpeg", { quality: 0.95 })
    );
  }

  return templatePath;
};

// ------------------------------
// MAIN FUNCTION
// ------------------------------
export const createCertificateImage = async (data) => {
  const templatePath = await createTemplateIfNotExists();
  const image = await loadImage(templatePath);

  const canvas = createCanvas(image.width, image.height);
  const ctx = canvas.getContext("2d");

  ctx.drawImage(image, 0, 0);

  const width = canvas.width;
  const height = canvas.height;
  const centerX = width / 2;

  // ------------------------------
  // Name
  // ------------------------------
  ctx.fillStyle = "#1A1A1A";
  ctx.font = "bold 100px 'Playfair Display'";
  ctx.textAlign = "center";
  ctx.fillText(data.name, centerX, 800);

  // ------------------------------
  // Business details
  // ------------------------------
  const labelX = centerX - 600;
  const valueX = centerX + 100;

  ctx.textAlign = "left";

  ctx.font = "bold 70px 'Playfair Display'";
  ctx.fillStyle = "#2C3E50";
  ctx.fillText("Business Name:", labelX, 1400);

  ctx.font = "70px 'Playfair Display'";
  ctx.fillStyle = "#1A1A1A";
  ctx.fillText(data.businessName, valueX, 1400);

  ctx.font = "bold 70px 'Playfair Display'";
  ctx.fillStyle = "#2C3E50";
  ctx.fillText("GST Number:", labelX, 1600);

  ctx.font = "70px 'Playfair Display'";
  ctx.fillStyle = "#1A1A1A";
  ctx.fillText(data.gstNumber, valueX, 1600);

  ctx.font = "bold 70px 'Playfair Display'";
  ctx.fillStyle = "#2C3E50";
  ctx.fillText("Business Address:", labelX, 1800);

  ctx.font = "70px 'Playfair Display'";
  ctx.fillStyle = "#1A1A1A";

  const words = data.businessAddress.split(" ");
  let line = "";
  let y = 1800;
  const maxWidth = 1400;

  for (const word of words) {
    const testLine = line + word + " ";
    if (ctx.measureText(testLine).width > maxWidth) {
      ctx.fillText(line, valueX, y);
      line = word + " ";
      y += 100;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, valueX, y);

  // ------------------------------
  // Footer / Signature (CENTERED)
  // ------------------------------
  const footerTop = height - 340;
  const issuedAt = formatDateTime(new Date());

  ctx.textAlign = "center";
  ctx.fillStyle = "#1A1A1A";

  // Signature name
  ctx.font = "italic 60px 'Playfair Display'";
  ctx.fillText("HamBolds", centerX, footerTop);

  // Signature underline (centered)
  ctx.beginPath();
  ctx.moveTo(centerX - 140, footerTop + 20);
  ctx.lineTo(centerX + 140, footerTop + 20);
  ctx.stroke();

  // Authorized Signature text
  ctx.font = "50px 'Playfair Display'";
  ctx.fillText("Authorized Signature", centerX, footerTop + 80);

  // Date (centered, next line)
  ctx.font = "50px 'Playfair Display'";
  ctx.fillText(`Date: ${issuedAt}`, centerX, footerTop + 150);

  // ------------------------------
  // Save output
  // ------------------------------
  const outputDir = path.join(__dirname, "../output");
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const outputPath = path.join(outputDir, `certificate_${Date.now()}.jpg`);

  fs.writeFileSync(outputPath, canvas.toBuffer("image/jpeg"));
  console.log("Certificate image saved to:", outputPath);

  return outputPath;
};
