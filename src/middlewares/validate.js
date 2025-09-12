// src/middlewares/validate.js
import { body, validationResult } from "express-validator";

export const registerUserRules = [
  body("fullName").notEmpty().withMessage("Full name is required"),
  body("email").isEmail().withMessage("Valid email is required"),
  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
  body("bio").notEmpty().withMessage("Bio is required"),
  body("jobCategory").notEmpty().withMessage("Job category is required"),
  body("jobDescription").notEmpty().withMessage("Job description is required"),
  body("skills").notEmpty().withMessage("Skills are required"),
  body("location").notEmpty().withMessage("Location is required"),
];


export const registerEmployerRules = [
  body("companyName").notEmpty().withMessage("Company name is required"),
  body("bio")
    .isLength({ max: 200 })
    .withMessage("Bio must be less than 200 characters"),
  body("industry").notEmpty().withMessage("Industry is required"),
  body("email").isEmail().withMessage("Valid email is required"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters")
];

export const loginRules = [
  body("email").isEmail().withMessage("Valid email is required"),
  body("password").notEmpty().withMessage("Password is required"),
];

export function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}
