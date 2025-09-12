export function authCookieOptions(env = {}) { 
    const { 
      NODE_ENV = 'development', 
      COOKIE_SECURE = 'false', 
      COOKIE_SAMESITE = 'lax' 
    } = env; 
   
    return { 
      httpOnly: true, 
      secure: COOKIE_SECURE === 'true' || NODE_ENV === 'production', 
      sameSite: COOKIE_SAMESITE, // 'lax' | 'strict' | 'none' 
      path: '/', 
      // Cookie expiry is controlled by JWT exp; keep cookie as a session cookie. 
    }; 
  } 