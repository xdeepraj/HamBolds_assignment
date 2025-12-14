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
        <div style="font-family: Arial, sans-serif;">
          <p>Dear ${name},</p>
          <p>
            Your GST certificate has been generated successfully.
            Please find the certificate attached in both JPG and PDF formats.
          </p>
          <p>Thank you for using our service.</p>
          <p style="font-size:12px;color:#666;">
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
