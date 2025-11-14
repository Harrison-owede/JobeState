import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  cv: {
    url: String,
    publicId: String,
  },
  employer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // the employer receiving the application
    required: true,
  },
  applicant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // the user applying
    required: true,
  },
}, { timestamps: true });

export const Application = mongoose.model("Application", applicationSchema);
