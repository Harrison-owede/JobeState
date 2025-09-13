import { Router } from 'express'; 
import { uploadResume } from '../middlewares/upload.js';
import { 
  registerUser, 
  registerEmployer, 
  login, 
  logout, 
  me, 
} from '../controllers/auth.controller.js'; 
import { protect, requireRole } from '../middlewares/auth.js'; 
import { authLimiter } from '../middlewares/rateLimiter.js'; 
import { registerUserRules, loginRules, validate,  registerEmployerRules, } from '../middlewares/validate.js'; 
 
const router = Router(); 
 
// CSRF helper endpoint (read token from req.csrfToken()) 
router.get('/csrf', (req, res) => { 
  res.json({ csrfToken: req.csrfToken ? req.csrfToken() : null }); 
}); 

 
router.post(
  "/register",
  uploadResume.single("resume"),
  (req, res, next) => {
    // Trim spaces from keys
    req.body = Object.fromEntries(
      Object.entries(req.body).map(([k, v]) => [k.trim(), v])
    );
    console.log("SANITIZED BODY:", req.body);
    next();
  },
  registerUserRules,
  validate,
  registerUser
);



router.post(
  "/register-employer",
  uploadResume.single("companyLogo"), // multer parses the file
  (req, res, next) => {
    // Trim spaces from keys & ensure form-data values are strings
    req.body = Object.fromEntries(
      Object.entries(req.body).map(([k, v]) => [k.trim(), typeof v === "string" ? v.trim() : v])
    );
    next();
  },
  registerEmployerRules, // ✅ should only check employer fields
  validate,
  registerEmployer
);

router.post('/login', authLimiter, loginRules, validate, login); 
router.post('/logout', protect, logout); 
router.get('/me', protect, me); 
 
// Example protected routes 
router.get('/admin-only', protect, requireRole('admin'), (req, res) => { 
  res.json({ secret: 'Admin dashboard data' }); 
}); 
 
router.get('/employee-portal', protect, requireRole('employee', 'admin'), (req, res) => { 
  res.json({ data: 'Employee resources' }); 
}); 
 
export default router; 