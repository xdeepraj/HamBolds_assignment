# HamBolds – GST Certificate Generation & Email Delivery System

A backend service that dynamically generates GST certificates (JPG + PDF) and delivers them via email.  
Built using **Node.js**, **Express**, **Canvas**, **PDFKit**, **Brevo (SMTP/API)** and deployed on **Railway**.

---

## 🚀 Features

- Generate GST certificates dynamically based on user input
- High-resolution certificate image (JPG)
- Print-ready certificate document (PDF)
- Email delivery with attachments
- Clean modular architecture (routes, controllers, services)
- Production-ready deployment on Railway (https://hamboldscertificatecreation.up.railway.app/api/generateCertificate)

---

## 🏗️ Project Architecture

HamBolds/
│
├── index.js
│
├── routes/
│ └── certificateRoute.js
│
├── controllers/
│ └── certificateCtrl.js
│
├── services/
│ ├── certificateService.js
│ └── emailService.js
│
├── output/
│ ├── certificate*<timestamp>.jpg
│ └── certificate*<timestamp>.pdf
│
├── templates/
│ └── certificate-template.jpg
│
├── fonts/
│ ├── DejaVuSans\*.ttf
│ ├── DejaVuSans-Bold\*.ttf
│ ├── DejaVuSans-BoldOblique\*.ttf
│ └── DejaVuSans-Oblique\*.ttf
│
├── utils/
│ └── pdfUtil.js
│
├── .env
├── package.json
└── README.md

## 🔄 Flow Overview

1. Client sends a POST request with business details
2. Certificate image is generated using `node-canvas`
3. PDF is generated using `pdfkit`
4. Email is sent with both files attached
5. Response contains success message and file paths

---

## 📡 API Endpoint

### Generate Certificate

**POST** `/api/generate-certificate`

#### Request Body (JSON)

```json
{
  "name": "TEST NAME",
  "email": "testgmail@gmail.com",
  "gstNumber": "QWERTY123456UOP",
  "businessName": "TEST CODING",
  "businessAddress": "TEST ADDRESS"
}
```

##### Success Response

```json
{
  "success": true,
  "message": "Certificate generated successfully",
  "imagePath": "/app/output/certificate_XXXXXXXX.jpg",
  "pdfPath": "/app/output/certificate_XXXXXXXX.pdf"
}
```
