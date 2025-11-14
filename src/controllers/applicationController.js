import { Application } from "../models/Application.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";

// User applies to employer
export const createApplication = asyncHandler(async (req, res) => {
  const { name, location, employerId } = req.body;
  if (!req.file) return res.status(400).json({ error: "CV file required" });

  const cv = { url: req.file.path, publicId: req.file.filename };

  const app = await Application.create({
    name,
    location,
    cv,
    employer: employerId,
    applicant: req.user._id,
  });

  res.status(201).json({ message: "Application submitted", app });
});

// Employer views all applications sent to them
export const getEmployerApplications = asyncHandler(async (req, res) => {
  const applications = await Application.find({ employer: req.user._id })
    .populate("applicant", "fullName email location");
  res.status(200).json(applications);
});
