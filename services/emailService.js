import nodemailer from "nodemailer";

// Create transporter lazily to ensure env vars are loaded
const getTransporter = () => {
  const emailUser = process.env.EMAIL_USER?.trim();
  const emailPass = process.env.EMAIL_PASS?.trim();

  if (!emailUser || !emailPass) {
    return null;
  }

  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: emailUser,
      pass: emailPass,
    },
  });
};

export const sendEmailWithAttachment = async (to, imagePath, pdfPath) => {
  const transporter = getTransporter();

  if (!transporter) {
    console.warn(
      "Email credentials not configured. Skipping email send. Certificate files are still generated."
    );
    console.warn("EMAIL_USER:", process.env.EMAIL_USER ? "Set" : "Not set");
    console.warn("EMAIL_PASS:", process.env.EMAIL_PASS ? "Set" : "Not set");
    return;
  }

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER.trim(),
      to,
      subject: "Your Certificate",
      text: "Please find your certificate attached.",
      attachments: [
        { filename: "certificate.jpg", path: imagePath },
        { filename: "certificate.pdf", path: pdfPath },
      ],
    });
    console.log(`Email sent successfully to ${to}`);
  } catch (error) {
    console.error("Error sending email:", error.message);
    throw error;
  }
};
