import express from "express";
import certificate from "../controllers/certificateCtrl.js";

const router = express.Router();

router.post("/generateCertificate", certificate.generateCertificate);

export default router;
