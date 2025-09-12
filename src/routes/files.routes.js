import { Router } from 'express';
import { protect } from '../middlewares/auth.js';
import { User } from '../models/User.js';
import { cloudinary } from '../config/cloudinary.js';

const router = Router();

router.get('/resume/:id', protect, async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user || !user.resume?.publicId) {
    return res.status(404).json({ error: 'Resume not found' });
  }

  // ✅ block others
  if (req.user.role !== 'admin' && req.user.id !== req.params.id) {
    return res.status(403).json({ error: 'Not allowed' });
  }

  const signedUrl = cloudinary.url(user.resume.publicId, {
    type: 'authenticated',
    resource_type: 'auto',
    sign_url: true,
    expires_at: Math.floor(Date.now() / 1000) + 3600 // 1h
  });

  res.json({ resumeUrl: signedUrl });
});

export default router;
