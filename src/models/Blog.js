import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
  image: {
    url: String,
    publicId: String,
  },
  title: { type: String, required: true },
  subHeadline: { type: String },
  info: { type: String, required: true },
}, { timestamps: true });

export const Blog = mongoose.model("Blog", blogSchema);
