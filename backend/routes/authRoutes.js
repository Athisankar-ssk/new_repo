import express from "express";
import {
  registerUser,
  loginUser,
  getUserDetails,
  updateUser
} from "../controllers/authController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";
import { uploadProfileImage } from "../controllers/authController.js";


const router = express.Router();

// PUBLIC ROUTES
router.post("/register", registerUser);
router.post("/login", loginUser);

// PROTECTED ROUTES
router.get("/me", authMiddleware, getUserDetails);
router.put("/update", authMiddleware, updateUser);
router.post(
  "/upload-profile",
  authMiddleware,
  upload.single("image"),
  uploadProfileImage
);

export default router;
