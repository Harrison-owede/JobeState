import { Job } from "../models/Job.js";
import { Notification } from "../models/Notification.js";
import nodemailer from "nodemailer";

// Create job (Admin only)
export const createJob = async (req, res) => {
    try {
      const { title, description, location, salaryRange } = req.body;
  
      const job = await Job.create({
        title,
        description,
        location,
        salaryRange,
        createdBy: req.user._id, // employer creating it
      });
  
      // --- Create DB notification for admin ---
      await Notification.create({
        message: `New job posted: ${job.title}. Awaiting approval.`,
        job: job._id,
      });
  
      // --- Send email to admin ---
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.ADMIN_EMAIL,
          pass: process.env.ADMIN_EMAIL_PASS,
        },
      });
  
      await transporter.sendMail({
        from: `"Job Portal" <${process.env.ADMIN_EMAIL}>`,
        to: process.env.ADMIN_EMAIL, // admin email
        subject: "New Job Posted - Approval Needed",
        text: `A new job has been posted: ${job.title}. Please review and approve/deny it.`,
      });
  
      res.status(201).json({ message: "Job created and sent for approval", job });
    } catch (err) {
      console.error("Error creating job:", err);
      res.status(500).json({ error: "Server error" });
    }
  };

  export const updateJobStatus = async (req, res) => {
    try {
      const { status } = req.body;
      if (!["approved", "rejected"].includes(status)) {
        return res.status(400).json({ error: "Invalid status" });
      }
  
      const job = await Job.findByIdAndUpdate(
        req.params.id,
        { status },
        { new: true }
      );
  
      if (!job) return res.status(404).json({ error: "Job not found" });
  
      res.json(job);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  };

// src/controllers/job.controller.js
export const getAllJobs = async (req, res) => {
    try {
      let { page = 1, limit = 10, title, salaryMin, salaryMax, location } = req.query;
  
      page = parseInt(page);
      limit = parseInt(limit);
  
      // --- Build filters ---
      const filters = { status: "approved" }; // ✅ only approved jobs
  
      if (title) {
        filters.title = { $regex: title, $options: "i" };
      }
  
      if (location) {
        filters.location = { $regex: location, $options: "i" };
      }
  
      if (salaryMin || salaryMax) {
        filters["salaryRange.min"] = { ...(salaryMin && { $gte: Number(salaryMin) }) };
        filters["salaryRange.max"] = { ...(salaryMax && { $lte: Number(salaryMax) }) };
      }
  
      // --- Query DB with filters ---
      const jobs = await Job.find(filters)
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createdAt: -1 });
  
      const totalJobs = await Job.countDocuments(filters);
  
      res.json({
        total: totalJobs,
        page,
        pages: Math.ceil(totalJobs / limit),
        jobs,
      });
    } catch (err) {
      console.error("Error fetching jobs:", err);
      res.status(500).json({ error: "Server error" });
    }
  };
  

  export const getPendingJobs = async (req, res) => {
    try {
      const jobs = await Job.find({ status: "pending" }).populate("createdBy", "fullName email");
      res.json(jobs);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  };
  

// Get all jobs (for frontend display)
export const getJobs = async (req, res, next) => {
  try {
    const jobs = await Job.find().populate("createdBy", "fullName email");
    res.json(jobs);
  } catch (err) {
    next(err);
  }
};

// ✅ Update Job
export const updateJob = async (req, res) => {
    try {
      const { id } = req.params;
  
      const job = await Job.findByIdAndUpdate(
        id,
        req.body,
        { new: true, runValidators: true }
      );
  
      if (!job) {
        return res.status(404).json({ error: "Job not found" });
      }
  
      res.json({ message: "Job updated successfully", job });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  };
  
  // ✅ Delete Job
  export const deleteJob = async (req, res) => {
    try {
      const { id } = req.params;
  
      const job = await Job.findByIdAndDelete(id);
  
      if (!job) {
        return res.status(404).json({ error: "Job not found" });
      }
  
      res.json({ message: "Job deleted successfully" });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  };
  
  // ✅ Get Single Job (optional)
  export const getJob = async (req, res) => {
    try {
      const { id } = req.params;
      const job = await Job.findById(id).populate("createdBy", "fullName email");
  
      if (!job) {
        return res.status(404).json({ error: "Job not found" });
      }
  
      res.json(job);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  };

  // controllers/job.controller.js
export const approveJob = async (req, res) => {
    try {
      const { id } = req.params; // job id
      const { status } = req.body; // "approved" or "denied"
  
      if (!["approved", "denied"].includes(status)) {
        return res.status(400).json({ error: "Invalid status" });
      }
  
      const job = await Job.findByIdAndUpdate(
        id,
        { status },
        { new: true }
      );
  
      if (!job) return res.status(404).json({ error: "Job not found" });
  
      res.json({ message: `Job ${status}`, job });
    } catch (err) {
      console.error("Error approving job:", err);
      res.status(500).json({ error: "Server error" });
    }
  };
  

 

// ✅ Search Jobs by Title (public)
export const searchJobs = async (req, res) => {
  try {
    const { q } = req.query; // frontend sends ?q=developer
    const jobs = await Job.find({
      title: { $regex: q, $options: "i" } // case-insensitive search
    });

    res.json(jobs);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// ✅ List all jobs (public)


// ✅ List jobs created by a specific admin (dashboard)
export const getMyJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ createdBy: req.user.id }).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
