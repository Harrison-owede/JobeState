import { Router } from "express";
import { protect, requireRole } from "../middlewares/auth.js";
import { uploadResume } from "../middlewares/upload.js";
import {
  createApplication,
  getEmployerApplications,
} from "../controllers/applicationController.js";

const router = Router();

// User creates application
router.post("/", protect, requireRole("user"), uploadResume.single("cv"), createApplication);

// Employer views all applications
router.get("/employer", protect, requireRole("employer"), getEmployerApplications);

export default router;
