// src/utils/issueAuth.js
import { signJwt } from "./jwt.js";
import { authCookieOptions } from "./cookie.js";

export const issueAuth = (res, user) => {
  const token = signJwt(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES || "1h" }
  );

  res.cookie("token", token, authCookieOptions(process.env));
};
