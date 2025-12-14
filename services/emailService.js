import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendEmailWithAttachment = async (to, imagePath, pdfPath) => {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject: "Your Certificate",
    text: "Please find your certificate attached.",
    attachments: [
      { filename: "certificate.jpg", path: imagePath },
      { filename: "certificate.pdf", path: pdfPath },
    ],
  });
};
