import { verifyJwt } from '../utils/jwt.js'; 
 
export function protect(req, res, next) { 
  try { 
    const token = req.cookies?.token; 
    if (!token) return res.status(401).json({ error: 'Not authenticated' }); 
 
    const payload = verifyJwt(token, process.env.JWT_SECRET); 
    req.user = payload; // { id, role } 
    next(); 
  } catch (err) { 
    return res.status(401).json({ error: 'Invalid or expired token' }); 
  } 
} 
 
export function requireRole(...roles) { 
  return (req, res, next) => { 
    if (!req.user) return res.status(401).json({ error: 'Not authenticated' }); 
    if (!roles.includes(req.user.role)) return res.status(403).json({ error: 'Forbidden' }); 
    next(); 
  }; 
} 