import express from "express";
import dotenv from "dotenv";
import certificateRoutes from "./routes/certificateRoute.js";

dotenv.config();

const app = express();
app.use(express.json());

// routes
app.use("/api", certificateRoutes);

// health check
app.get("/", (req, res) => {
  res.send("Certificate Generation API is running...");
});

// server
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
