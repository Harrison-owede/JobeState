import { Blog } from "../models/Blog.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";

export const getAllBlogs = asyncHandler(async (req, res) => {
  const blogs = await Blog.find().sort({ createdAt: -1 });
  res.status(200).json(blogs);
});
