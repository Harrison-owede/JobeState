import jwt from 'jsonwebtoken'; 
 
export function signJwt(payload, secret, options = {}) { 
  return jwt.sign(payload, secret, { ...options }); 
} 
 
export function verifyJwt(token, secret) { 
  return jwt.verify(token, secret); 
} 