import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// --- constants ---
const ROLES = ["user", "employee", "employer", "admin"];

// --- sub-schemas ---
const resumeSchema = new mongoose.Schema(
  {
    url: String,       // convenient but not secure alone
    publicId: String   // needed for signing
  },
  { _id: false }
);

const employerProfileSchema = new mongoose.Schema(
  {
    companyLogo: {
      url: { type: String },
      publicId: { type: String }
    },
    companyName: { type: String, required: true, trim: true, maxlength: 120 },
    bio: { type: String, maxlength: 200 },
    industry: { type: String, required: true, trim: true },
    website: { type: String, trim: true },
    location: { type: String, trim: true }
  },
  { _id: false }
);


// --- main user schema ---
const userSchema = new mongoose.Schema(
  {
    // Identity
    fullName: { type: String, required: true, trim: true, maxlength: 120 },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true
    },
    password: { type: String, required: true, select: false, minlength: 8 },
    role: { type: String, enum: ROLES, default: "user", index: true },

    // Account status
    isActive: { type: Boolean, default: true },
    lastLogin: { type: Date },
    passwordChangedAt: { type: Date },

    // Job seeker fields
    bio: { type: String, maxlength: 200 },
    jobCategory: { type: String, trim: true },
    jobDescription: { type: String, trim: true },
    skills: [{ type: String, trim: true }],
    location: { type: String, trim: true },
    resume: resumeSchema,

    // Employer fields (optional, when role === "employee")
    employerProfile: employerProfileSchema
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        delete ret.password;
        delete ret.__v;
        return ret;
      }
    },
    toObject: { virtuals: true }
  }
);

// --- middleware ---
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  if (!this.isNew) this.passwordChangedAt = new Date();
  next();
});

// --- instance methods ---
userSchema.methods.comparePassword = function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

userSchema.methods.changedPasswordAfter = function (jwtIatSeconds) {
  if (!this.passwordChangedAt) return false;
  const changedAt = Math.floor(this.passwordChangedAt.getTime() / 1000);
  return changedAt > jwtIatSeconds;
};

// --- model export ---
export const User = mongoose.model("User", userSchema);
