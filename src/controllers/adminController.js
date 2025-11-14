import { User } from "../models/User.js";
import { Blog } from "../models/Blog.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";

// GET all users
export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({ role: "user" }).select("-password");
  res.status(200).json(users);
});

// DELETE user
export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json({ message: "User deleted successfully" });
});

// GET all employers
export const getAllEmployers = asyncHandler(async (req, res) => {
  const employers = await User.find({ role: "employer" }).select("-password");
  res.status(200).json(employers);
});

// DELETE employer
export const deleteEmployer = asyncHandler(async (req, res) => {
  const employer = await User.findByIdAndDelete(req.params.id);
  if (!employer) return res.status(404).json({ error: "Employer not found" });
  res.json({ message: "Employer deleted successfully" });
});

// CREATE blog post
export const createBlog = asyncHandler(async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "Image is required" });

  const { title, subHeadline, info } = req.body;
  const image = { url: req.file.path, publicId: req.file.filename };

  const blog = await Blog.create({ image, title, subHeadline, info });
  res.status(201).json({ message: "Blog created successfully", blog });
});
