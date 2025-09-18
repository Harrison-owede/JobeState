import 'dotenv/config';
import http from 'http';
import app from './app.js';
import { connectDB } from './src/config/db.js';

const PORT = process.env.PORT || 5000;

(async () => {
  try {
    await connectDB(process.env.MONGODB_URI);

    const server = http.createServer(app);
    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('❌ DB connection failed:', err);
    process.exit(1);
  }
})();
