import { Router } from "express";
import { getAllBlogs } from "../controllers/blogController.js";

const router = Router();

router.get("/", getAllBlogs);

export default router;
