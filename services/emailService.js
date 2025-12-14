import nodemailer from "nodemailer";
import fs from "fs";

// Initialize Brevo SMTP transporter
const createTransporter = () => {
  const smtpLogin = process.env.BREVO_SMTP_LOGIN?.trim();
  const smtpKey = process.env.BREVO_SMTP_KEY?.trim();
  const smtpHost =
    process.env.BREVO_SMTP_HOST?.trim() || "smtp-relay.brevo.com";
  const smtpPort = parseInt(process.env.BREVO_SMTP_PORT?.trim()) || 587;
  const fromEmail = process.env.FROM_EMAIL?.trim();

  if (!smtpLogin || !smtpKey) {
    return null;
  }

  return {
    transporter: nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: false, // STARTTLS for port 587
      auth: {
        user: smtpLogin,
        pass: smtpKey,
      },
      tls: {
        rejectUnauthorized: false, // Helps with cloud platforms
      },
      connectionTimeout: 20000,
      greetingTimeout: 20000,
      socketTimeout: 20000,
    }),
    fromEmail: fromEmail || smtpLogin, // Use FROM_EMAIL or fallback to SMTP login
  };
};

export const sendEmailWithAttachment = async (to, name, imagePath, pdfPath) => {
  const transportConfig = createTransporter();

  if (!transportConfig) {
    console.warn(
      "Brevo SMTP credentials not configured. Skipping email send. Certificate files are still generated."
    );
    console.warn(
      "BREVO_SMTP_LOGIN:",
      process.env.BREVO_SMTP_LOGIN ? "Set" : "Not set"
    );
    console.warn(
      "BREVO_SMTP_KEY:",
      process.env.BREVO_SMTP_KEY ? "Set" : "Not set"
    );
    return;
  }

  const { transporter, fromEmail } = transportConfig;

  try {
    // Read files
    const imageBuffer = fs.readFileSync(imagePath);
    const pdfBuffer = fs.readFileSync(pdfPath);

    const imageFilename =
      imagePath.split("/").pop() ||
      imagePath.split("\\").pop() ||
      "certificate.jpg";
    const pdfFilename =
      pdfPath.split("/").pop() ||
      pdfPath.split("\\").pop() ||
      "certificate.pdf";

    const mailOptions = {
      from: fromEmail.includes("@") ? `HamBolds <${fromEmail}>` : fromEmail,
      to,
      subject: "Your GST Certificate",
      text: "Please find your GST certificate attached to this email.",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; text-align: left;">
          <p>Dear ${name},</p>
          <p>
            Your GST certificate has been generated successfully.
            Please find the certificate attached in both JPG and PDF formats.
          </p>
          <ul>
            <li>Certificate Image (JPG)</li>
            <li>Certificate Document (PDF)</li>
          </ul>
          <p>Thank you for using our service.</p>
          <p style="font-size: 12px; color: #666;">
            This is an automated email. Please do not reply.
          </p>
        </div>
      `,
      attachments: [
        {
          filename: imageFilename,
          content: imageBuffer,
          contentType: "image/jpeg",
        },
        {
          filename: pdfFilename,
          content: pdfBuffer,
          contentType: "application/pdf",
        },
      ],
    };

    const info = await transporter.sendMail(mailOptions);

    console.log(`Email sent successfully to ${to}`);
    console.log("Message ID:", info.messageId);
  } catch (error) {
    console.error("Error sending email via Brevo:", error.message);
    if (error.response) {
      console.error("Brevo error response:", error.response);
    }
    if (error.code) {
      console.error("Error code:", error.code);
    }
    throw error;
  }
};
