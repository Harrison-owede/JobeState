// src/middlewares/sanitize.js
import mongoSanitize from 'express-mongo-sanitize';

export default function sanitize() {
  return (req, res, next) => {
    if (req.body) mongoSanitize.sanitize(req.body);
    if (req.params) mongoSanitize.sanitize(req.params);
    // skip req.query → avoids "Cannot set property query" crash
    next();
  };
}
