import { createCertificateImage } from "../services/certificateService.js";
import { createPdfFromImage } from "../utils/pdfUtil.js";
import { sendEmailWithAttachment } from "../services/emailService.js";

const certificate = {
  generateCertificate: async (req, res) => {
    try {
      const { name, email, gstNumber, businessName, businessAddress } =
        req.body;

      if (!name || !email || !gstNumber || !businessName || !businessAddress) {
        return res.status(400).json({
          success: false,
          message: "All fields are required",
        });
      }

      const imagePath = await createCertificateImage({
        name,
        gstNumber,
        businessName,
        businessAddress,
      });
      console.log("Image created at:", imagePath);

      const pdfPath = imagePath.replace(".jpg", ".pdf");
      await createPdfFromImage(imagePath, pdfPath);
      console.log("PDF created at:", pdfPath);

      let emailSent = false;
      try {
        await sendEmailWithAttachment(email, name, imagePath, pdfPath);
        emailSent = true;
      } catch (emailError) {
        console.error("Email sending failed:", emailError.message);
        // Continue even if email fails - certificate is still generated
      }

      res.status(200).json({
        success: true,
        message: emailSent
          ? "Certificate generated & emailed successfully"
          : "Certificate generated successfully (email not sent - check email configuration)",
        imagePath,
        pdfPath,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  },
};

export default certificate;
