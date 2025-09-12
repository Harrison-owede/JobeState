import dotenv from "dotenv";
import { connectDB } from "../src/config/db.js";
import { User } from "../src/models/User.js";

dotenv.config();

(async () => {
  try {
    await connectDB(process.env.MONGODB_URI);
    const result = await User.deleteMany({ role: "admin" });
    console.log(`🗑️ Deleted ${result.deletedCount} admin users`);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
