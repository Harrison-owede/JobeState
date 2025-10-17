import 'dotenv/config';
import app from './app.js';
import { connectDB } from './src/config/db.js';

// Connect to MongoDB when the app starts
(async () => {
  try {
    await connectDB(process.env.MONGODB_URI);
    console.log('✅ MongoDB connected successfully');
  } catch (err) {
    console.error('❌ DB connection failed:', err);
  }
})();

// ✅ Export the Express app instead of listening (for Vercel)
export default app;

// ✅ Local testing support
const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => console.log(`🚀 Server running locally on port ${PORT}`));
}

