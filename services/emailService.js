import fs from "fs";

const BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";

export const sendEmailWithAttachment = async (to, name, imagePath, pdfPath) => {
  const apiKey = process.env.BREVO_API_KEY;
  const fromEmail = process.env.FROM_EMAIL;

  if (!apiKey || !fromEmail) {
    console.warn("Brevo API not configured. Skipping email send.");
    return;
  }

  try {
    const imageBase64 = fs.readFileSync(imagePath).toString("base64");
    const pdfBase64 = fs.readFileSync(pdfPath).toString("base64");

    const payload = {
      sender: {
        name: "HamBolds",
        email: fromEmail,
      },
      to: [
        {
          email: to,
          name: name,
        },
      ],
      subject: "Your GST Certificate",
      htmlContent: `
        <div style="font-family: Arial, sans-serif; max-width:600px; margin:0 auto; text-align:left;">
          <p>Dear ${name},</p>

          <p>
            Congratulations! Your GST certificate has been generated successfully.
            Please find the certificate attached in both JPG and PDF formats.
          </p>

          <p>
            You may keep this certificate for your official records.
          </p>

          <p>Thank you for choosing HamBolds.</p>

          <hr style="border:none;border-top:1px solid #e0e0e0;margin:24px 0;" />

          <p style="margin:0;font-weight:bold;">HamBolds Team</p>
          <p style="margin:4px 0 0 0;">
            Email:
            <a href="mailto:support@hambolds.com" style="color:#1a73e8;text-decoration:none;">
              support@hambolds.com
            </a>
          </p>

          <p style="font-size:12px;color:#666;margin-top:16px;">
            This is an automated email. Please do not reply.
          </p>
        </div>
      `,
      attachment: [
        {
          content: imageBase64,
          name: "certificate.jpg",
        },
        {
          content: pdfBase64,
          name: "certificate.pdf",
        },
      ],
    };

    const response = await fetch(BREVO_API_URL, {
      method: "POST",
      headers: {
        "api-key": apiKey,
        "Content-Type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(JSON.stringify(result));
    }

    console.log("Email sent successfully via Brevo API:", result.messageId);
  } catch (error) {
    console.error("Error sending email via Brevo API:", error.message);
    throw error;
  }
};
