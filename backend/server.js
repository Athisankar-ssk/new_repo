import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import path from "path";

dotenv.config();
const app = express();

// Middleware
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.use(express.json());
app.use(cors());
app.use("/uploads", express.static("uploads"));


// Connect DB
connectDB();

// Routes
app.use("/api/auth", authRoutes);

// Start server
app.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`)
);
