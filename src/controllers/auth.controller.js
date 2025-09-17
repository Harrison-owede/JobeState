// src/controllers/auth.controller.js
import { User } from '../models/User.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import { issueAuth } from "../utils/issueAuth.js";

export const registerUser = asyncHandler(async (req, res) => {
  const {
    fullName,
    email,
    password,
    bio,
    jobCategory,
    jobDescription,
    skills,
    location,
  } = req.body;

  const parsedSkills =
    typeof skills === "string"
      ? skills.split(",").map((s) => s.trim()).filter(Boolean)
      : skills;

  const exists = await User.findOne({ email });
  if (exists) {
    return res.status(409).json({ error: "Email already in use" });
  }

  const resume = req.file
    ? { url: req.file.path, publicId: req.file.filename }
    : undefined;

  const user = await User.create({
    fullName,
    email,
    password,
    role: "user",
    bio,
    jobCategory,
    jobDescription,
    skills: parsedSkills,
    location,
    resume,
  });

  issueAuth(res, user);

  res.status(201).json({
    message: "User registered successfully",
    user: {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      bio: user.bio,
      jobCategory: user.jobCategory,
      jobDescription: user.jobDescription,
      skills: user.skills,
      location: user.location,
      resume: user.resume,
    },
  });
});


// export const registerEmployee = asyncHandler(async (req, res) => {
//   const {
//     fullName,
//     email,
//     password,
//     bio,
//     jobCategory,
//     jobDescription,
//     skills,
//     location
//   } = req.body;

//   // Parse skills (string → array)
//   const parsedSkills =
//     typeof skills === "string"
//       ? skills.split(",").map((s) => s.trim()).filter(Boolean)
//       : skills;

//   // Check if email already exists
//   const exists = await User.findOne({ email });
//   if (exists) {
//     return res.status(409).json({ error: "Email already in use" });
//   }

//   // Handle file upload (resume)
//   const resume = req.file
//     ? { url: req.file.path, publicId: req.file.filename }
//     : undefined;

//   // Create employee user
//   const user = await User.create({
//     fullName,
//     email,
//     password,
//     role: "employee",
//     bio,
//     jobCategory,
//     jobDescription,
//     skills: parsedSkills,
//     location,
//     resume
//   });

//   // Issue JWT cookie
//   issueAuth(res, user);

//   res.status(201).json({
//     message: "Employee registered",
//     user: sanitizeUser(user)
//   });
// });

export const registerEmployer = asyncHandler(async (req, res) => {
  const { companyName, bio, industry, website, location, email, password } =
    req.body;

  // Require all fields
  if (
    !companyName ||
    !bio ||
    !industry ||
    !website ||
    !location ||
    !email ||
    !password ||
    !req.file
  ) {
    return res.status(400).json({ error: "All fields (including logo) are required" });
  }

  // Check if email already exists
  const exists = await User.findOne({ email });
  if (exists) {
    return res.status(409).json({ error: "Email already in use" });
  }

  // Handle company logo file upload (Cloudinary)
  const companyLogo = {
    url: req.file.path,        // Cloudinary URL
    publicId: req.file.filename // Cloudinary public ID
  };

  // Create employer user
  const user = await User.create({
    fullName: companyName,
    email,
    password,
    role: "employer",
    employerProfile: {
      companyLogo,
      companyName,
      bio,
      industry,
      website,
      location
    }
  });

  // Issue JWT cookie
  issueAuth(res, user);

  res.status(201).json({
    message: "Employer registered",
    user: sanitizeUser(user) // make sure sanitizeUser no longer includes `skills`
  });
});


export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Find user by email
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  // Validate password
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  // Issue JWT cookie
  issueAuth(res, user);

  res.status(200).json({
    message: "Logged in successfully",
    user: sanitizeUser(user)
  });
});


export const logout = asyncHandler(async (req, res) => {
  // Clear cookie (must match name used in issueAuth)
  res.clearCookie("jwt", authCookieOptions(process.env));
  res.status(200).json({ message: "Logged out" });
});

export const me = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).lean();
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  res.status(200).json({
    user: sanitizeUser(user)
  });
});

function sanitizeUser(user) {
  return {
    id: user._id,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
    bio: user.bio,
    jobCategory: user.jobCategory,
    jobDescription: user.jobDescription,
    skills: user.skills,
    location: user.location,
    resume: user.resume
  };
}

