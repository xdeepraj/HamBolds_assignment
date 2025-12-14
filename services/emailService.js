import nodemailer from "nodemailer";

// Create transporter lazily to ensure env vars are loaded
const getTransporter = () => {
  const emailUser = process.env.EMAIL_USER?.trim();
  const emailPass = process.env.EMAIL_PASS?.trim();

  if (!emailUser || !emailPass) {
    return null;
  }

  // Use explicit SMTP configuration with timeout settings for cloud platforms
  // Try port 465 (SSL) first, Railway might block port 587
  const port = parseInt(process.env.EMAIL_PORT) || 465;
  const secure = port === 465;
  
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || "smtp.gmail.com",
    port: port,
    secure: secure, // true for 465, false for other ports
    auth: {
      user: emailUser,
      pass: emailPass,
    },
    tls: {
      // Do not fail on invalid certs (helps with cloud platforms)
      rejectUnauthorized: false,
    },
    connectionTimeout: 20000, // 20 seconds
    greetingTimeout: 20000, // 20 seconds
    socketTimeout: 20000, // 20 seconds
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
    // Send email with timeout (removed verify() as it can timeout on cloud platforms)
    const mailOptions = {
      from: process.env.EMAIL_USER.trim(),
      to,
      subject: "Your Certificate",
      text: "Please find your certificate attached.",
      html: `
        <h2>Certificate Generated Successfully</h2>
        <p>Dear ${to.split('@')[0]},</p>
        <p>Please find your GST certificate attached to this email.</p>
        <p>Thank you!</p>
      `,
      attachments: [
        { filename: "certificate.jpg", path: imagePath },
        { filename: "certificate.pdf", path: pdfPath },
      ],
    };

    const info = await Promise.race([
      transporter.sendMail(mailOptions),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Email send timeout after 30 seconds")), 30000)
      ),
    ]);

    console.log(`Email sent successfully to ${to}`, info.messageId);
  } catch (error) {
    console.error("Error sending email:", error.message);
    console.error("Full error:", error);
    throw error;
  }
};
