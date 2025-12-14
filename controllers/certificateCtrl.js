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

      const pdfPath = imagePath.replace(".jpg", ".pdf");
      await createPdfFromImage(imagePath, pdfPath);

      await sendEmailWithAttachment(email, imagePath, pdfPath);

      res.status(200).json({
        success: true,
        message: "Certificate generated & emailed successfully",
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
