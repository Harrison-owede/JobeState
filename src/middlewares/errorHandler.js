// Centralized error handler 
export function notFound(req, res, next) { 
    res.status(404).json({ error: 'Route not found' }); 
  } 
   
  export function errorHandler(err, req, res, next) { // eslint-disable-line 
    console.error(err); 
    const status = err.status || 500; 
    const message = err.message || 'Internal Server Error'; 
    res.status(status).json({ error: message }); 
  } 