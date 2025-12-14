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

## 🖼️ Certificate Output

- Image: JPG (high resolution, suitable for preview)
- Document: PDF (A4 landscape, print-ready)

## 📧 Email Delivery

- Emails are sent using **Brevo** (formerly Sendinblue)
- Attachments:
  - Certificate Image (JPG)
  - Certificate Document (PDF)
- Sender name: **HamBolds**
- Subject: **Your GST Certificate**

## ⚙️ Environment Variables

Create a `.env` file in the root directory with the following values:

```env
PORT=5000
BREVO_API_KEY=your_brevo_api_key
BREVO_SENDER_EMAIL=your_verified_sender_email

```

## ▶️ Run Locally

- Install Dependencies

```
npm install
```

- Start the Server

```
npm run dev
```

- The server will start on: http://localhost:5000

## ☁️ Deployment (Railway)

This project is deployed using Railway.

- Deployment Steps
  - Push the code to GitHub
  - Create a new Railway project
  - Connect the GitHub repository
  - Add the required environment variables in Railway

Railway automatically builds and deploys on every push

## 🧠 Design Decisions

- Canvas-based certificate generation used instead of HTML-to-PDF to ensure consistent rendering in headless environments.
- Fonts are bundled to avoid Linux fontconfig issues in containerized environments.
- Clear separation of concerns between routing, controllers, and services.

## 📧 Email Delivery

- Emails are sent using Brevo (formerly Sendinblue)
- Attachments:
  - Certificate Image (JPG)
  - Certificate Document (PDF)
- Sender name: HamBolds
- Subject: Your GST Certificate

## ⚠️ Notes & Limitations

- Generated certificates are stored inside the container filesystem.
- In production, files can be moved to cloud storage (AWS S3, GCP, etc.).
- Email delivery depends on Brevo API availability.

## 🔮 Future Enhancements

- Certificate verification using QR codes
- Cloud storage integration for generated certificates
- Admin dashboard to manage issued certificates
- Authentication and rate limiting

## 👨‍💻 Author

Deepraj Sarkar

## 📄 License

This project is created for educational and assessment purposes.
