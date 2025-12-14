import express from "express";
import {
  registerUser,
  loginUser,
  getUserDetails,
  updateUser
} from "../controllers/authController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// PUBLIC ROUTES
router.post("/register", registerUser);
router.post("/login", loginUser);

// PROTECTED ROUTES
router.get("/me", authMiddleware, getUserDetails);
router.put("/update", authMiddleware, updateUser);

export default router;
