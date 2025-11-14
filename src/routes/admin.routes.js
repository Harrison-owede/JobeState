import { Router } from "express";
import { protect, requireRole } from "../middlewares/auth.js";
import { uploadResume } from "../middlewares/upload.js";
import {
  getAllUsers,
  deleteUser,
  getAllEmployers,
  deleteEmployer,
  createBlog,
} from "../controllers/adminController.js";

const router = Router();

router.use(protect, requireRole("admin"));

router.get("/users", getAllUsers);
router.delete("/users/:id", deleteUser);
router.get("/employers", getAllEmployers);
router.delete("/employers/:id", deleteEmployer);
router.post("/blogs", uploadResume.single("image"), createBlog);

export default router;
