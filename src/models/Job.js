// models/Job.js
import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    salaryRange: {
      min: Number,
      max: Number,
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    status: {
      type: String,
      enum: ["pending", "approved", "denied"],
      default: "pending", // ✅ all jobs start as pending
    },
  },
  { timestamps: true }
);

export const Job = mongoose.model("Job", jobSchema);
