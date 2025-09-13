import express from "express";
import { protect, requireRole } from "../middlewares/auth.js";
import {
  createJob,
  updateJob,
  deleteJob,
  getJob,
  getAllJobs,
  getMyJobs,
  searchJobs,
  approveJob,
  getPendingJobs
} from "../controllers/job.controller.js";

const router = express.Router();

/* ================================
   🔹 PUBLIC ROUTES
================================ */
// ✅ Get all approved jobs (frontend listing)
router.get("/", getAllJobs);

// ✅ Search jobs by title
router.get("/search", searchJobs);

// ✅ Get single job by ID
router.get("/:id", getJob);


/* ================================
   🔹 EMPLOYER ROUTES
================================ */
// ✅ Employer creates job (defaults to pending)
router.post("/", protect, createJob);


/* ================================
   🔹 ADMIN ROUTES
================================ */
// ✅ Get all jobs created by this admin
router.get("/me/mine", protect, requireRole("admin"), getMyJobs);

// ✅ Get all pending jobs
router.get("/pending/list", protect, requireRole("admin"), getPendingJobs);

// ✅ Approve or deny a job
router.put("/:id/approve", protect, requireRole("admin"), approveJob);

// ✅ Update a job (any admin can update now)
router.put("/:id", protect, requireRole("admin"), updateJob);

// ✅ Delete a job (any admin can delete now)
router.delete("/:id", protect, requireRole("admin"), deleteJob);

export default router;




