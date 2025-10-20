import 'dotenv/config';
import app from './app.js';
import { connectDB } from './src/config/db.js';

// Connect to MongoDB when the app starts
(async () => {
  try {
    await connectDB(process.env.MONGODB_URI);
    console.log('✅ MongoDB connected successfully');

    // ✅ Start server after successful DB connection
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  } catch (err) {
    console.error('❌ DB connection failed:', err);
    process.exit(1);
  }
})();
